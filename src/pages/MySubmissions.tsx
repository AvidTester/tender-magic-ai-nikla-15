
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Edit, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DisputeButton } from '@/components/disputes/DisputeButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Define submission type
type Submission = {
  _id: string;
  tenderId: {
    _id: string;
    title: string;
    deadline: string;
  };
  submissionDate: string;
  status: string;
  documents: any[];
  rejectionDate?: string;
};

const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch submissions by the current vendor
        const response = await fetch(`http://localhost:5000/api/submissions/vendor/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: "Error",
          description: "Failed to load submissions. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [user]);
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Submissions</h1>
            <p className="text-muted-foreground">Track and manage your tender submissions</p>
          </div>
          <Button asChild>
            <Link to="/available-tenders">Browse Tenders</Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Tender Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tender</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No submissions found. Browse available tenders to submit a proposal.
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => (
                      <TableRow key={submission._id}>
                        <TableCell className="font-medium">{submission.tenderId.title}</TableCell>
                        <TableCell>{new Date(submission.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              submission.status === 'Won' 
                                ? "default" 
                                : submission.status === 'Rejected' 
                                  ? "destructive" 
                                  : "secondary"
                            }
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-muted-foreground" /> 
                            {submission.documents.length}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/submissions/${submission._id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            
                            {submission.status === 'Submitted' && (
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/update-submission/${submission._id}`}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                            )}
                            
                            {submission.status === 'Rejected' && (
                              <DisputeButton
                                tenderId={submission.tenderId._id}
                                tenderTitle={submission.tenderId.title}
                                tenderEndDate={submission.rejectionDate || submission.submissionDate}
                                disputeTimeFrameDays={3}
                                disputeType="rejection"
                                variant="secondary"
                                size="sm"
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MySubmissions;
