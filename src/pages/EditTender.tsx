import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Check, Save, X, Calendar, Users } from 'lucide-react';
import { FileUploader } from '@/components/tenders/FileUploader';
import { toast } from '@/hooks/use-toast';
import { format, parse } from 'date-fns';

// Mock tender data (would typically come from an API)
const tenders = [
  {
    id: 1,
    title: 'Office Equipment Procurement',
    description: 'Seeking a vendor to supply office equipment including computers, printers, and furniture.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-05-30',
    minBudget: 50000,
    maxBudget: 100000,
    requirements: [
      'Must have experience in providing IT equipment',
      'Must be able to deliver within 30 days',
      'Must provide warranty for all equipment'
    ],
    documents: [
      { id: 1, name: 'Tender_Specification.pdf', size: '2.4 MB' },
      { id: 2, name: 'Terms_and_Conditions.pdf', size: '1.8 MB' }
    ],
    evaluators: [1, 3, 5], // IDs of assigned evaluators
    submissions: 4
  },
  {
    id: 2,
    title: 'IT Services Procurement',
    description: 'Looking for a provider of IT services, including network maintenance, cybersecurity, and cloud solutions.',
    category: 'IT',
    status: 'Open',
    deadline: '2025-06-15',
    minBudget: 75000,
    maxBudget: 150000,
    requirements: [
      'Minimum 5 years experience in IT services',
      'Must have certified professionals',
      'Must provide 24/7 support'
    ],
    documents: [
      { id: 3, name: 'Service_Level_Agreement.pdf', size: '3.1 MB' },
      { id: 4, name: 'Technical_Requirements.pdf', size: '2.2 MB' }
    ],
    evaluators: [2, 4], // IDs of assigned evaluators
    submissions: 7
  }
];

// Mock evaluators data
const evaluators = [
  { id: 1, name: 'John Smith', department: 'IT', specialization: 'Hardware', evaluationsCompleted: 12 },
  { id: 2, name: 'Sarah Johnson', department: 'Finance', specialization: 'Budget Analysis', evaluationsCompleted: 8 },
  { id: 3, name: 'Michael Brown', department: 'Operations', specialization: 'Process Optimization', evaluationsCompleted: 15 },
  { id: 4, name: 'Emily Davis', department: 'Legal', specialization: 'Contract Review', evaluationsCompleted: 10 },
  { id: 5, name: 'David Wilson', department: 'IT', specialization: 'Software', evaluationsCompleted: 7 }
];

export default function EditTender() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tender, setTender] = useState<any>(null);
  const [selectedEvaluators, setSelectedEvaluators] = useState<number[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [requirements, setRequirements] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API fetch
    const fetchTender = () => {
      setIsLoading(true);
      try {
        const foundTender = tenders.find(t => t.id === Number(id));
        
        if (foundTender) {
          setTender(foundTender);
          // Set form data
          setTitle(foundTender.title);
          setDescription(foundTender.description);
          setCategory(foundTender.category);
          setDeadline(parse(foundTender.deadline, 'yyyy-MM-dd', new Date()));
          setMinBudget(foundTender.minBudget.toString());
          setMaxBudget(foundTender.maxBudget.toString());
          setRequirements(foundTender.requirements.join('\n'));
          setDocuments(foundTender.documents);
          setSelectedEvaluators(foundTender.evaluators || []);
        }
      } catch (error) {
        console.error('Error fetching tender:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tender details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTender();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !description || !category || !deadline || !minBudget || !maxBudget) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Prepare updated tender data
    const updatedTender = {
      ...tender,
      title,
      description,
      category,
      deadline: format(deadline, 'yyyy-MM-dd'),
      minBudget: parseInt(minBudget, 10),
      maxBudget: parseInt(maxBudget, 10),
      requirements: requirements.split('\n').filter(req => req.trim() !== ''),
      documents,
      evaluators: selectedEvaluators
    };

    // In a real app, you would call an API here
    console.log('Saving updated tender:', updatedTender);
    
    toast({
      title: 'Success',
      description: 'Tender has been updated successfully',
    });
    
    // Navigate back to tenders list
    navigate('/tenders');
  };

  const handleCancelEdit = () => {
    navigate('/tenders');
  };

  const toggleEvaluator = (evaluatorId: number) => {
    setSelectedEvaluators(prev => 
      prev.includes(evaluatorId)
        ? prev.filter(id => id !== evaluatorId)
        : [...prev, evaluatorId]
    );
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    // In a real app, you would upload the files to a server
    const newDocuments = files.map((file, index) => ({
      id: documents.length + index + 1,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    }));
    
    setDocuments(prev => [...prev, ...newDocuments]);
    
    toast({
      title: 'Files uploaded',
      description: `${files.length} file(s) added successfully`,
    });
  };

  const removeDocument = (docId: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-muted-foreground">Loading tender details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!tender) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Tender Not Found</CardTitle>
              <CardDescription>
                The tender you are looking for doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/tenders')}>Back to Tenders</Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Edit Tender</h1>
            <p className="text-muted-foreground">Update tender details and requirements</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic details about the tender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter tender title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Supply">Supply</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter detailed description of the tender"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <DatePicker
                      value={deadline}
                      onChange={setDeadline}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minBudget">Minimum Budget ($)</Label>
                  <Input 
                    id="minBudget" 
                    value={minBudget} 
                    onChange={(e) => setMinBudget(e.target.value)} 
                    placeholder="Min budget"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBudget">Maximum Budget ($)</Label>
                  <Input 
                    id="maxBudget" 
                    value={maxBudget} 
                    onChange={(e) => setMaxBudget(e.target.value)} 
                    placeholder="Max budget"
                    type="number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Specify what vendors must provide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea 
                  id="requirements" 
                  value={requirements} 
                  onChange={(e) => setRequirements(e.target.value)} 
                  placeholder="Enter requirements, one per line"
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Manage tender documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <FileUploader onUpload={handleFileUpload} />
                </div>
                
                {documents.length > 0 && (
                  <div className="border rounded-md divide-y">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{doc.name}</span>
                          <Badge variant="outline">{doc.size}</Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeDocument(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Evaluator Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluator Assignment</CardTitle>
              <CardDescription>Select who will evaluate this tender</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {evaluators.map((evaluator) => (
                  <div 
                    key={evaluator.id}
                    className={`border rounded-md p-4 cursor-pointer transition-colors ${
                      selectedEvaluators.includes(evaluator.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/30'
                    }`}
                    onClick={() => toggleEvaluator(evaluator.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{evaluator.name}</span>
                      {selectedEvaluators.includes(evaluator.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {evaluator.department} · {evaluator.specialization}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="mt-2 bg-blue-50 text-blue-800"
                    >
                      {evaluator.evaluationsCompleted} evaluations
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
