
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  InfoIcon,
  Calendar,
  FilePlus,
  Edit,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock tender data
const tenders = [
  {
    id: 1,
    title: 'Office Equipment Procurement',
    description: 'Seeking a vendor to supply office equipment including computers, printers, and furniture.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-05-30',
    submissions: 4,
    evaluators: 2
  },
  {
    id: 2,
    title: 'IT Services Procurement',
    description: 'Looking for a provider of IT services, including network maintenance, cybersecurity, and cloud solutions.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-06-15',
    submissions: 7,
    evaluators: 3
  },
  {
    id: 3,
    title: 'Construction Services',
    description: 'Requesting bids for construction services for a new office building.',
    category: 'Construction',
    status: 'Open',
    deadline: '2025-07-01',
    submissions: 3,
    evaluators: 2
  },
  {
    id: 4,
    title: 'Office Supplies Contract',
    description: 'Recurring supply of office materials including paper, pens, and other stationery items.',
    category: 'Supply',
    status: 'Open',
    deadline: '2025-05-20',
    submissions: 5,
    evaluators: 1
  },
  {
    id: 5,
    title: 'Networking Equipment',
    description: 'Procurement of routers, switches, and other networking equipment for a new data center.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-06-10',
    submissions: 6,
    evaluators: 2
  },
  {
    id: 6,
    title: 'Building Renovation',
    description: 'Renovation of an existing government building, including structural repairs and interior updates.',
    category: 'Construction',
    status: 'Closed',
    deadline: '2025-04-15',
    submissions: 8,
    evaluators: 3
  },
];

const Tenders = () => {
  const filteredTendersByStatus = (status: string) => {
    if (status === 'all') return tenders;
    return tenders.filter(tender => tender.status.toLowerCase() === status.toLowerCase());
  };

  const renderTenderCard = (tender: any) => (
    <Card key={tender.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{tender.title}</CardTitle>
          <Badge variant={tender.status === 'Open' ? 'default' : 'secondary'}>
            {tender.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {tender.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Deadline: {tender.deadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{tender.category}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Evaluators: {tender.evaluators}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-blue-50">Submissions: {tender.submissions}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/tenders/${tender.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/tenders/${tender.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tenders</h1>
            <p className="text-muted-foreground">Manage all procurement tenders</p>
          </div>
          <Button asChild>
            <Link to="/create-tender">
              <FilePlus className="mr-2 h-4 w-4" />
              Create Tender
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Tenders</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByStatus('all').map(renderTenderCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="open" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByStatus('open').map(renderTenderCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="closed" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTendersByStatus('closed').map(renderTenderCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tenders;
