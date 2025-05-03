
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DisputesList, type Dispute } from '@/components/disputes/DisputesList';
import { DisputeDetail } from '@/components/disputes/DisputeDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Disputes = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDisputes = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/disputes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch disputes');
        }
        
        const data = await response.json();
        setDisputes(data);
      } catch (error) {
        console.error('Error fetching disputes:', error);
        toast({
          title: "Error",
          description: "Failed to load disputes. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDisputes();
  }, [user]);

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleStatusChange = async (disputeId: string, status: 'rejected' | 'accepted', response: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiResponse = await fetch(`http://localhost:5000/api/disputes/${disputeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, responseText: response })
      });
      
      if (!apiResponse.ok) {
        throw new Error('Failed to update dispute');
      }
      
      const updatedDispute = await apiResponse.json();
      
      // Update disputes state
      setDisputes(prevDisputes => 
        prevDisputes.map(d => d.id === disputeId ? updatedDispute : d)
      );
      
      toast({
        title: "Dispute updated",
        description: `The dispute status has been updated to ${status}.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating dispute:', error);
      toast({
        title: "Error",
        description: "Failed to update dispute. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getFilteredDisputes = () => {
    switch (activeTab) {
      case 'pending':
        return disputes.filter(d => d.status === 'pending');
      case 'resolved':
        return disputes.filter(d => d.status === 'accepted' || d.status === 'rejected');
      default:
        return disputes;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Disputes Management</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {user?.role === 'admin' ? 'Manage Tender Disputes' : 'My Disputes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Disputes</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-4 space-y-4">
                  <DisputesList
                    disputes={getFilteredDisputes()}
                    isAdmin={user?.role === 'admin'}
                    onViewDispute={handleViewDispute}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <DisputeDetail
          dispute={selectedDispute}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          onStatusChange={user?.role === 'admin' ? handleStatusChange : undefined}
        />
      </div>
    </MainLayout>
  );
};

export default Disputes;
