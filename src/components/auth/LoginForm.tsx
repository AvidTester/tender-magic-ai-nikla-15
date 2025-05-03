
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LoginForm = () => {
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Get the return URL from location state or default to dashboard
  const from = location.state?.from?.pathname || '/';

  // Check if the API is accessible
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${window.location.protocol}//${window.location.hostname}:5000/api`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        setApiStatus('offline');
      }
    };
    
    checkApiStatus();
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (apiStatus === 'offline') {
      toast({
        title: "Backend server offline",
        description: "Please make sure the backend server is running on port 5000",
        variant: "destructive"
      });
      return;
    }
    
    setLoginError(null);
    setIsLoggingIn(true);
    
    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the procurement platform!",
        });
        navigate(from, { replace: true });
      } else {
        setLoginError('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error in form:', error);
      setLoginError('Connection error. Please make sure the backend server is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Access the procurement platform with your credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {loginError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            
            {apiStatus === 'offline' && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Backend server appears to be offline. Please make sure it's running on port 5000.
                </AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-sm">
              <h3 className="font-medium mb-2">Demo Accounts:</h3>
              <div className="text-muted-foreground space-y-1">
                <p>- admin@example.com (Admin)</p>
                <p>- vendor@example.com (Vendor)</p>
                <p>- evaluator1@example.com (Evaluator)</p>
                <p>- evaluator2@example.com (Evaluator)</p>
                <p className="mt-1 italic">Password: password123</p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-4" 
              disabled={isLoggingIn || authLoading || apiStatus === 'checking'}
            >
              {isLoggingIn || authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {apiStatus === 'online' ? 'Backend server connected' : 
           apiStatus === 'checking' ? 'Checking server status...' : 
           'Backend server not detected - ensure it is running on port 5000'}
        </p>
      </CardFooter>
    </Card>
  );
};
