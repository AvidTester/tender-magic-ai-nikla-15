
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  Building,
  FileText,
  Edit,
  Eye
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const submissions = [
  {
    id: 'S-101',
    tender: {
      id: 'T-2023-42',
      title: 'IT Infrastructure Upgrade'
    },
    submissionDate: '2025-05-01',
    status: 'Under Review',
    canEdit: true
  },
  {
    id: 'S-102',
    tender: {
      id: 'T-2023-38',
      title: 'Website Redesign Project'
    },
    submissionDate: '2025-04-20',
    status: 'Selected',
    canEdit: false
  },
  {
    id: 'S-103',
    tender: {
      id: 'T-2023-37',
      title: 'Staff Training Services'
    },
    submissionDate: '2025-04-15',
    status: 'Rejected',
    canEdit: false
  },
  {
    id: 'S-104',
    tender: {
      id: 'T-2023-41',
      title: 'Office Supplies Procurement'
    },
    submissionDate: '2025-05-03',
    status: 'Pending',
    canEdit: true
  }
];

const MySubmissions = () => {
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'under review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Under Review</Badge>;
      case 'selected':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Selected</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">My Submissions</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-3 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search submissions..." 
                className="pl-9 w-full md:w-[240px]" 
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">My Tender Submissions</CardTitle>
            <CardDescription>
              View and manage all your tender submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tender</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.id}</TableCell>
                    <TableCell>
                      <Link 
                        to={`/tenders/${submission.tender.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {submission.tender.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(submission.submissionDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link to={`/submissions/${submission.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Link>
                        </Button>
                        
                        {submission.canEdit && (
                          <Button 
                            size="sm"
                            asChild
                          >
                            <Link to={`/update-submission/${submission.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Update
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {submissions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No submissions yet</h3>
                <p className="text-muted-foreground mb-4">You haven't submitted any tenders yet.</p>
                <Button asChild>
                  <Link to="/available-tenders">Browse Available Tenders</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MySubmissions;
