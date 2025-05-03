
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Mock submissions data
const mockSubmissions = [
  {
    id: 's1',
    vendorName: 'TechSolutions Inc.',
    submissionDate: '2025-04-20',
    status: 'Evaluated',
    score: 87,
    documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile'],
    details: {
      contactPerson: 'John Smith',
      email: 'john@techsolutions.com',
      phone: '+1 (555) 123-4567',
      technicalNotes: 'Strong technical proposal with comprehensive approach.',
      financialNotes: 'Pricing is competitive but on the higher end of the budget range.',
      evaluatorComments: 'Good track record, strong technical capabilities, slightly expensive.'
    }
  },
  {
    id: 's2',
    vendorName: 'Global Services Ltd.',
    submissionDate: '2025-04-22',
    status: 'Evaluated',
    score: 92,
    documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile'],
    details: {
      contactPerson: 'Sarah Johnson',
      email: 'sarah@globalservices.com',
      phone: '+1 (555) 987-6543',
      technicalNotes: 'Excellent technical approach with innovative solutions.',
      financialNotes: 'Very competitive pricing structure.',
      evaluatorComments: 'Exceptional proposal with strong value for money.'
    }
  },
  {
    id: 's3',
    vendorName: 'Innovate Systems',
    submissionDate: '2025-04-18',
    status: 'Evaluated',
    score: 75,
    documents: ['Technical Proposal', 'Financial Proposal', 'Company Profile'],
    details: {
      contactPerson: 'Michael Brown',
      email: 'michael@innovatesystems.com',
      phone: '+1 (555) 456-7890',
      technicalNotes: 'Adequate technical approach but lacks some detail.',
      financialNotes: 'Budget-friendly proposal.',
      evaluatorComments: 'Acceptable but not outstanding in any area.'
    }
  },
  {
    id: 's4',
    vendorName: 'Quality Equipment Co.',
    submissionDate: '2025-04-23',
    status: 'Under Review',
    score: null,
    documents: ['Technical Proposal', 'Financial Proposal'],
    details: {
      contactPerson: 'Lisa Adams',
      email: 'lisa@qualityequipment.com',
      phone: '+1 (555) 234-5678',
      technicalNotes: 'Pending review',
      financialNotes: 'Pending review',
      evaluatorComments: 'Submission received, pending evaluation.'
    }
  }
];

const TenderSubmissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'score',
    direction: 'desc'
  });
  
  // State for submission detail dialog
  const [selectedSubmission, setSelectedSubmission] = useState<typeof mockSubmissions[0] | null>(null);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  
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

  // Handle view submission details
  const handleViewSubmission = (submission: typeof mockSubmissions[0]) => {
    setSelectedSubmission(submission);
    setSubmissionDialogOpen(true);
  };

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
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewSubmission(submission)}
                      >
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

      {/* Submission Detail Dialog */}
      <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Review details for submission from {selectedSubmission?.vendorName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{selectedSubmission.vendorName}</h3>
                  <p className="text-sm text-muted-foreground">Submission ID: {selectedSubmission.id}</p>
                </div>
                <Badge variant={selectedSubmission.status === 'Evaluated' ? 'secondary' : 'outline'}>
                  {selectedSubmission.status}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Contact Information</h4>
                    <div className="mt-2 text-sm">
                      <p><strong>Contact Person:</strong> {selectedSubmission.details.contactPerson}</p>
                      <p><strong>Email:</strong> {selectedSubmission.details.email}</p>
                      <p><strong>Phone:</strong> {selectedSubmission.details.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">Documents</h4>
                    <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                      {selectedSubmission.documents.map((doc, index) => (
                        <li key={index}>
                          <span className="text-blue-600 cursor-pointer hover:underline">
                            {doc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Evaluation</h4>
                    <div className="mt-2 text-sm">
                      {selectedSubmission.score !== null ? (
                        <>
                          <p>
                            <strong>Score:</strong> 
                            <span className={`ml-1 font-medium ${selectedSubmission.score >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                              {selectedSubmission.score}/100
                            </span>
                          </p>
                          <p><strong>Technical Assessment:</strong> {selectedSubmission.details.technicalNotes}</p>
                          <p><strong>Financial Assessment:</strong> {selectedSubmission.details.financialNotes}</p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">This submission has not been evaluated yet.</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">Evaluator Comments</h4>
                    <p className="mt-2 text-sm">{selectedSubmission.details.evaluatorComments}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmissionDialogOpen(false)}>
              Close
            </Button>
            {selectedSubmission?.status !== 'Evaluated' && (
              <Button>
                Evaluate Submission
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TenderSubmissions;
