
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/tenders/FileUploader';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  FileText, 
  BarChart2, 
  Calendar, 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  PlusCircle
} from 'lucide-react';

// Tender categories for select dropdown
const tenderCategories = [
  { value: 'it', label: 'IT Services' },
  { value: 'construction', label: 'Construction' },
  { value: 'supplies', label: 'Office Supplies' },
  { value: 'consulting', label: 'Consulting Services' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'marketing', label: 'Marketing & Communication' },
  { value: 'training', label: 'Training & Development' }
];

// Evaluation criteria templates
const evaluationCriteriaTemplates = [
  { 
    id: 'technical',
    name: 'Technical Capability',
    weight: 40
  },
  { 
    id: 'financial',
    name: 'Financial Offer',
    weight: 30
  },
  { 
    id: 'experience',
    name: 'Experience',
    weight: 20
  },
  { 
    id: 'delivery',
    name: 'Delivery Timeline',
    weight: 10
  }
];

// Document templates
const documentTemplates = [
  {
    id: 'financial',
    name: 'Financial Proposal',
    type: 'Template'
  },
  {
    id: 'technical',
    name: 'Technical Requirements',
    type: 'Template'
  },
  {
    id: 'terms',
    name: 'Terms & Conditions',
    type: 'Template'
  }
];

// Sample evaluators
const evaluators = [
  {
    id: 'js',
    name: 'John Smith',
    email: 'john@example.com',
    department: 'IT'
  },
  {
    id: 'ew',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    department: 'Procurement'
  },
  {
    id: 'mb',
    name: 'Michael Brown',
    email: 'michael@example.com',
    department: 'Finance'
  },
  {
    id: 'as',
    name: 'Anna Smith',
    email: 'anna@example.com',
    department: 'Legal'
  }
];

// Form schema type
interface TenderFormValues {
  title: string;
  description: string;
  referenceId: string;
  category: string;
  budget: string;
  requirements: string;
  documents: File[];
  submissionDeadline: Date | undefined;
  announcementDate: Date | undefined;
  evaluationCriteria: Array<{
    name: string;
    weight: number;
  }>;
  selectedEvaluators: string[];
}

const CreateTender = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customCriteria, setCustomCriteria] = useState<{name: string, weight: number}[]>([]);
  const [usePresetCriteria, setUsePresetCriteria] = useState(true);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TenderFormValues>({
    defaultValues: {
      title: '',
      description: '',
      referenceId: '',
      category: '',
      budget: '',
      requirements: '',
      submissionDeadline: undefined,
      announcementDate: undefined,
      documents: [],
      evaluationCriteria: evaluationCriteriaTemplates,
      selectedEvaluators: []
    }
  });

  const selectedEvaluators = watch('selectedEvaluators') || [];

  // Handle form submission
  const onSubmit = (data: TenderFormValues) => {
    // Here you would typically send the data to your backend API
    console.log('Form submitted:', data);
    
    // Show success toast
    toast({
      title: 'Success!',
      description: 'Tender has been created successfully.',
      variant: 'default',
    });
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    setValue('documents', files);
  };

  // Navigate between steps
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add a custom evaluation criteria
  const addCustomCriteria = () => {
    setCustomCriteria([...customCriteria, { name: '', weight: 0 }]);
  };

  // Update custom criteria
  const updateCustomCriteria = (index: number, field: 'name' | 'weight', value: string | number) => {
    const updated = [...customCriteria];
    if (field === 'name') {
      updated[index].name = value as string;
    } else {
      updated[index].weight = value as number;
    }
    setCustomCriteria(updated);
  };

  // Toggle evaluator selection
  const toggleEvaluator = (evaluatorId: string) => {
    const current = [...selectedEvaluators];
    const index = current.indexOf(evaluatorId);
    
    if (index === -1) {
      current.push(evaluatorId);
    } else {
      current.splice(index, 1);
    }
    
    setValue('selectedEvaluators', current);
  };

  // Get tab class for styling the step indicators
  const getTabClass = (step: number) => {
    return currentStep === step 
      ? "bg-primary text-primary-foreground" 
      : "bg-muted text-muted-foreground";
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex flex-col mb-8">
          <h1 className="text-2xl font-bold">Create New Tender</h1>
          <p className="text-muted-foreground mt-1">
            Follow the step-by-step process to create and publish a new tender.
          </p>
        </div>
        
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute h-1 bg-border inset-x-0 top-1/2 -translate-y-1/2 z-0"></div>
          
          {/* Step 1 - Basic Information */}
          <button 
            onClick={() => setCurrentStep(1)}
            className={`relative z-10 flex items-center justify-center rounded-full w-10 h-10 
              ${getTabClass(1)} transition-colors`}
          >
            <span>1</span>
          </button>
          
          {/* Step 2 - Documents */}
          <button 
            onClick={() => setCurrentStep(2)}
            className={`relative z-10 flex items-center justify-center rounded-full w-10 h-10 
              ${getTabClass(2)} transition-colors`}
          >
            <span>2</span>
          </button>
          
          {/* Step 3 - Evaluation Criteria */}
          <button 
            onClick={() => setCurrentStep(3)}
            className={`relative z-10 flex items-center justify-center rounded-full w-10 h-10 
              ${getTabClass(3)} transition-colors`}
          >
            <span>3</span>
          </button>
          
          {/* Step 4 - Deadlines */}
          <button 
            onClick={() => setCurrentStep(4)}
            className={`relative z-10 flex items-center justify-center rounded-full w-10 h-10 
              ${getTabClass(4)} transition-colors`}
          >
            <span>4</span>
          </button>
          
          {/* Step 5 - Evaluators */}
          <button 
            onClick={() => setCurrentStep(5)}
            className={`relative z-10 flex items-center justify-center rounded-full w-10 h-10 
              ${getTabClass(5)} transition-colors`}
          >
            <span>5</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-4 px-1">
          <div className={`flex items-center ${currentStep === 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
            <ClipboardList className="h-5 w-5 mr-2" />
            <span>Basic Information</span>
          </div>
          <div className={`flex items-center ${currentStep === 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
            <FileText className="h-5 w-5 mr-2" />
            <span>Documents</span>
          </div>
          <div className={`flex items-center ${currentStep === 3 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
            <BarChart2 className="h-5 w-5 mr-2" />
            <span>Evaluation Criteria</span>
          </div>
          <div className={`flex items-center ${currentStep === 4 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
            <Calendar className="h-5 w-5 mr-2" />
            <span>Deadlines</span>
          </div>
          <div className={`flex items-center ${currentStep === 5 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
            <Users className="h-5 w-5 mr-2" />
            <span>Evaluators</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="border rounded-lg bg-card">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-medium">Basic Information</h2>
                <span className="text-sm text-muted-foreground">Step 1 of 5</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tender Title</Label>
                  <Input 
                    id="title"
                    placeholder="Enter a clear, descriptive title for this tender"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referenceId">Reference ID</Label>
                    <Input 
                      id="referenceId"
                      placeholder="e.g., PROC-2023-001"
                      {...register('referenceId')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Unique reference number for this procurement
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      onValueChange={value => setValue('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenderCategories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select the category that best fits this procurement
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Provide a detailed description of the tender requirements and objectives"
                    className="min-h-[150px]"
                    {...register('description', { required: 'Description is required' })}
                  />
                  <p className="text-xs text-muted-foreground">
                    This description will be visible to all vendors
                  </p>
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget</Label>
                  <Input 
                    id="budget"
                    placeholder="e.g., $10,000 - $15,000"
                    {...register('budget')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Provide an estimated budget range for this tender
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Documents */}
          {currentStep === 2 && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-medium">Documents</h2>
                <span className="text-sm text-muted-foreground">Step 2 of 5</span>
              </div>
              
              <div className="border border-dashed rounded-lg p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <FileUploader 
                    onFileUpload={handleFileUpload}
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024} // 10MB
                    acceptedFileTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
                  />
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">Document Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Select document templates to include with this tender
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {documentTemplates.map((template) => (
                    <div key={template.id} className="border rounded-md p-4 hover:bg-accent transition-colors cursor-pointer flex flex-col">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">{template.type}</p>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary opacity-0 hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Evaluation Criteria */}
          {currentStep === 3 && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-medium">Evaluation Criteria</h2>
                <span className="text-sm text-muted-foreground">Step 3 of 5</span>
              </div>
              
              <Tabs defaultValue={usePresetCriteria ? "preset" : "custom"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preset" onClick={() => setUsePresetCriteria(true)}>Preset Criteria</TabsTrigger>
                  <TabsTrigger value="custom" onClick={() => setUsePresetCriteria(false)}>Custom Criteria</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preset" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Select from predefined evaluation criteria templates based on procurement type
                  </p>
                  
                  <div className="space-y-4">
                    {evaluationCriteriaTemplates.map((criteria, index) => (
                      <div key={criteria.id} className="flex items-center justify-between border rounded-md p-4">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                          <span>{criteria.name} ({criteria.weight}%)</span>
                        </div>
                        <Button variant="outline" size="sm" type="button">Edit Weight</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Create custom evaluation criteria specific to your procurement needs
                  </p>
                  
                  <div className="space-y-4">
                    {customCriteria.map((criteria, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 items-center">
                        <div className="col-span-2">
                          <Input 
                            placeholder={`Criteria ${index + 1} name`} 
                            value={criteria.name}
                            onChange={(e) => updateCustomCriteria(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="number" 
                            placeholder="Weight %" 
                            value={criteria.weight || ''}
                            onChange={(e) => updateCustomCriteria(index, 'weight', parseInt(e.target.value))}
                            className="w-24"
                          />
                          <span>%</span>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      onClick={addCustomCriteria}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Another Criteria
                    </Button>
                    
                    <div className="bg-muted rounded-md p-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Evaluation Criteria Tips:</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ensure your criteria are clear, measurable, and relevant to the tender requirements. 
                        The combined weight of all criteria should equal 100%.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Step 4: Deadlines */}
          {currentStep === 4 && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-medium">Deadlines</h2>
                <span className="text-sm text-muted-foreground">Step 4 of 5</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Submission Deadline</Label>
                  <DatePicker 
                    onSelect={(date) => setValue('submissionDeadline', date)}
                    selected={watch('submissionDeadline')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Last date for vendors to submit their proposals
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Announcement Date</Label>
                  <DatePicker 
                    onSelect={(date) => setValue('announcementDate', date)}
                    selected={watch('announcementDate')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Date when the winner will be announced
                  </p>
                </div>
              </div>
              
              <div className="border rounded-md p-4 mt-8">
                <h3 className="text-lg font-medium mb-4">Timeline Preview</h3>
                
                <div className="relative pl-8 space-y-8">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-border"></div>
                  
                  <div className="relative">
                    <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      1
                    </div>
                    <h4 className="font-medium">Publication</h4>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      2
                    </div>
                    <h4 className="font-medium">Q&A Period</h4>
                    <p className="text-sm text-muted-foreground">Date to be calculated</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      3
                    </div>
                    <h4 className="font-medium">Submission Deadline</h4>
                    <p className="text-sm text-muted-foreground">
                      {watch('submissionDeadline') ? new Date(watch('submissionDeadline')).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      4
                    </div>
                    <h4 className="font-medium">Evaluation Period</h4>
                    <p className="text-sm text-muted-foreground">Date to be calculated</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      5
                    </div>
                    <h4 className="font-medium">Winner Announcement</h4>
                    <p className="text-sm text-muted-foreground">
                      {watch('announcementDate') ? new Date(watch('announcementDate')).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 5: Evaluators */}
          {currentStep === 5 && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-medium">Evaluators</h2>
                <span className="text-sm text-muted-foreground">Step 5 of 5</span>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select team members who will review and score vendor submissions
                </p>
                
                <div className="space-y-2">
                  {evaluators.map(evaluator => (
                    <div 
                      key={evaluator.id} 
                      className="flex items-center justify-between border rounded-md p-4 hover:bg-accent transition-colors"
                      onClick={() => toggleEvaluator(evaluator.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center uppercase">
                          {evaluator.id.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{evaluator.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {evaluator.email} • {evaluator.department}
                          </p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={selectedEvaluators.includes(evaluator.id)}
                        onChange={() => toggleEvaluator(evaluator.id)}
                        className="h-5 w-5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6 border-t flex justify-between">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={previousStep}>
                Previous
              </Button>
            ) : (
              <Button type="button" variant="outline">
                Save Draft
              </Button>
            )}
            
            {currentStep < 5 ? (
              <Button type="button" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button type="submit">
                Publish Tender
              </Button>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateTender;
