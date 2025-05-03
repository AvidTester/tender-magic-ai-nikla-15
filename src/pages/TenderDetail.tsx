
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CalendarIcon, 
  FileText,
  Briefcase,
  Download,
  ClipboardList,
  Users,
  ListChecks,
  ArrowLeft
} from 'lucide-react';

// Mock tender data
const tenderData = {
  id: 1,
  title: 'Office Equipment Procurement',
  reference: 'T-2023-42',
  description: 'Seeking a vendor to supply office equipment including computers, printers, and furniture.',
  category: 'IT',
  status: 'Open',
  deadline: '2025-05-30',
  budget: '$50,000',
  organization: 'Ministry of Education',
  publishDate: '2025-05-01',
  documents: [
    { id: 1, name: 'Tender Specification Document', type: 'pdf', size: '2.4 MB' },
    { id: 2, name: 'Equipment Requirements', type: 'docx', size: '1.8 MB' },
    { id: 3, name: 'Evaluation Criteria', type: 'pdf', size: '1.1 MB' }
  ],
  evaluationCriteria: [
    { name: 'Technical Capability', weight: '40%' },
    { name: 'Price', weight: '30%' },
    { name: 'Past Experience', weight: '20%' },
    { name: 'Delivery Schedule', weight: '10%' }
  ],
  submissions: 12,
  evaluatorsAssigned: ['John Smith', 'Emma Wilson', 'Michael Brown'],
  requiresNDA: true,
  tags: ['IT', 'Equipment', 'Urgent']
};

const TenderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  // Use the mock data
  const tender = tenderData;

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link to="/tenders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tenders
            </Link>
          </Button>
          
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold">{tender.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">Reference: {tender.reference}</span>
                <Badge>{tender.status}</Badge>
                {tender.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {user?.role === 'admin' && (
                <Button asChild>
                  <Link to={`/tenders/${id}/edit`}>Edit Tender</Link>
                </Button>
              )}
              
              {user?.role === 'vendor' && tender.status === 'Open' && (
                <Button asChild>
                  <Link to={`/apply-tender/${id}`}>Apply for Tender</Link>
                </Button>
              )}
              
              {user?.role === 'evaluator' && (
                <Button asChild>
                  <Link to={`/evaluate-tender/${id}`}>Evaluate Submissions</Link>
                </Button>
              )}
              
              {(user?.role === 'admin' || user?.role === 'evaluator') && (
                <Button variant="outline" asChild>
                  <Link to={`/tenders/${id}/submissions`}>
                    <ListChecks className="h-4 w-4 mr-2" />
                    View Submissions
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation Criteria</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Tender Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Description</h3>
                      <p className="text-sm">{tender.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Publication Date</h3>
                        <p className="text-sm flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {tender.publishDate}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Submission Deadline</h3>
                        <p className="text-sm flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {tender.deadline}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Budget</h3>
                        <p className="text-sm">{tender.budget}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Organization</h3>
                        <p className="text-sm">{tender.organization}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Tender Documents</CardTitle>
                    <CardDescription>Documents related to this tender</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tender.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.size} • {doc.type.toUpperCase()}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="evaluation">
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                    <CardDescription>How submissions will be evaluated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tender.evaluationCriteria.map((criteria, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{criteria.name}</p>
                          </div>
                          <Badge variant="secondary">{criteria.weight}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tender Status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge>{tender.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Submissions</div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{tender.submissions}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Evaluators</div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{tender.evaluatorsAssigned.length}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Requires NDA</div>
                  <div>{tender.requiresNDA ? 'Yes' : 'No'}</div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full" asChild>
                  <Link to={`/tenders/${id}/submissions`}>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    View All Submissions
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {user?.role === 'admin' && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Administration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Evaluators
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Update Documents
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TenderDetail;
