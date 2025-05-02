
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/tenders/FileUploader';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';

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

// Form schema type
interface TenderFormValues {
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline: Date | undefined;
  documents: File[];
  requirements: string;
}

const CreateTender = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TenderFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      budget: '',
      deadline: undefined,
      documents: [],
      requirements: ''
    }
  });

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

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold">Create New Tender</h1>
          <p className="text-muted-foreground mt-1">
            Fill out the form below to create a new procurement tender.
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tender Title</Label>
                <Input 
                  id="title"
                  placeholder="Enter tender title"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Provide a detailed description of the tender"
                  className="min-h-[120px]"
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={value => setValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenderCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget</Label>
                  <Input 
                    id="budget"
                    placeholder="e.g. $10,000 - $15,000"
                    {...register('budget')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Technical Requirements</Label>
                <Textarea 
                  id="requirements"
                  placeholder="List all technical requirements and specifications"
                  className="min-h-[150px]"
                  {...register('requirements')}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Submission Deadline</Label>
                <DatePicker 
                  onSelect={(date) => setValue('deadline', date)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Upload Documents</Label>
                <FileUploader 
                  onFileUpload={handleFileUpload}
                  maxFiles={5}
                  maxSize={5 * 1024 * 1024} // 5MB
                  acceptedFileTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
                />
                <p className="text-xs text-muted-foreground">
                  Upload tender documents, specifications, or any supporting materials. 
                  Accepted formats: PDF, DOC, DOCX, XLS, XLSX. Max 5MB per file.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button">
              Save as Draft
            </Button>
            <Button type="submit">
              Publish Tender
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateTender;
