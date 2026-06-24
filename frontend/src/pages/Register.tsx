import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { getBackendErrorMessage } from '@/utils/apiErrors';
import { useAuth } from '@/hooks/useAuth';
import { Seo } from '@/components/Seo';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Password and confirm password must match.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ email, password });
      toast({ title: 'Account created', description: 'You are now signed in.' });
      navigate('/', { replace: true });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: getBackendErrorMessage(error, 'Unable to create account. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Seo
        title="Create Account | Gym Manager Pro"
        description="Create a Gym Manager Pro account to access the gym management dashboard."
        path="/register"
      />
      <div className="pointer-events-none hidden sm:block absolute -left-28 bottom-10 h-64 w-64 rotate-6 border-4 border-primary bg-card" />
      <div className="pointer-events-none hidden sm:block absolute -right-20 top-12 h-72 w-72 -rotate-6 border-4 border-primary bg-secondary" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-3 sm:px-4 py-6 sm:py-10">
        <Card className="w-full max-w-md border-4 border-primary shadow-lg">
          <CardHeader className="space-y-2 border-b-4 border-primary p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-none tracking-tight">Create Your Gym Manager Pro Account</h1>
            <CardDescription className="text-xs sm:text-sm">Register a new account for dashboard access.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-xs sm:text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-primary pl-10 text-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold text-xs sm:text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-primary pl-10 pr-10 text-sm"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-semibold text-xs sm:text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-2 border-primary pl-10 pr-10 text-sm"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    aria-pressed={showConfirmPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full border-2 border-primary text-sm sm:text-base" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
              Already registered?{' '}
              <Link to="/login" className="font-bold underline underline-offset-4">
                Sign in instead
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
