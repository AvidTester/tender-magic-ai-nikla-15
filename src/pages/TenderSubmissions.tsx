
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Download,
  Eye,
} from 'lucide-react';

// Mock submissions data
const mockSubmissions = [
  {
    id: 's1',
    vendorName: 'TechSolutions Inc.',
    submissionDate: '2025-04-20',
    status: 'Evaluated',
    score: 87,
    documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile'],
  },
  {
    id: 's2',
    vendorName: 'Global Services Ltd.',
    submissionDate: '2025-04-22',
    status: 'Evaluated',
    score: 92,
    documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile'],
  },
  {
    id: 's3',
    vendorName: 'Innovate Systems',
    submissionDate: '2025-04-18',
    status: 'Evaluated',
    score: 75,
    documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile'],
  },
  {
    id: 's4',
    vendorName: 'Quality Equipment Co.',
    submissionDate: '2025-04-23',
    status: 'Under Review',
    score: null,
    documents: ['Technical Proposal', 'Financial Proposal'],
  }
];

const TenderSubmissions = () => {
  const { id } = useParams();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'score',
    direction: 'desc'
  });
  
  // Mock tender data
  const tender = {
    id: id,
    title: 'Office Equipment Procurement',
    reference: 'T-2023-42',
    status: 'Evaluation Stage',
  };

  // Get submissions data (would fetch from API in a real app)
  const submissions = mockSubmissions;
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const sortedSubmissions = React.useMemo(() => {
    let sortableItems = [...submissions];
    
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] === null) return 1;
        if (b[sortConfig.key as keyof typeof b] === null) return -1;
        
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [submissions, sortConfig]);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link to={`/tenders/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tender Details
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{tender.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">Reference: {tender.reference}</span>
                <Badge variant="outline">{tender.status}</Badge>
              </div>
            </div>
            <Button className="mt-3 md:mt-0" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Submissions ({submissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('submissionDate')}
                  >
                    Submission Date {sortConfig?.key === 'submissionDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('score')}
                  >
                    Score {sortConfig?.key === 'score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.vendorName}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell>
                      <Badge variant={submission.status === 'Evaluated' ? 'secondary' : 'outline'}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {submission.score !== null ? (
                        <span className={`font-medium ${submission.score >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                          {submission.score}/100
                        </span>
                      ) : (
                        'Pending'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{submission.documents.length} files</span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TenderSubmissions;
