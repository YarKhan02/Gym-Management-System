import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { getBackendErrorMessage } from '@/utils/apiErrors';
import { useAuth } from '@/hooks/useAuth';
import { Seo } from '@/components/Seo';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ email, password });
      const nextPath = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      toast({ title: 'Welcome back', description: 'You are now signed in.' });
      navigate(nextPath, { replace: true });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: getBackendErrorMessage(error, 'Unable to sign in. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Seo
        title="Sign In | Gym Manager Pro"
        description="Sign in to Gym Manager Pro to manage members, subscriptions, and payments."
        path="/login"
      />
      <div className="pointer-events-none hidden sm:block absolute -left-24 -top-24 h-72 w-72 border-4 border-primary bg-card" />
      <div className="pointer-events-none hidden sm:block absolute -bottom-20 -right-20 h-64 w-64 border-4 border-primary bg-secondary" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-3 sm:px-4 py-6 sm:py-10">
        <Card className="w-full max-w-md border-4 border-primary shadow-lg">
          <CardHeader className="space-y-2 border-b-4 border-primary p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-none tracking-tight">Gym Manager Pro Sign In</h1>
            <CardDescription className="text-xs sm:text-sm">Use your account to access the gym dashboard.</CardDescription>
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
                    placeholder="Enter your password"
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

              <Button type="submit" className="w-full border-2 border-primary text-sm sm:text-base" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
              New here?{' '}
              <Link to="/register" className="font-bold underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
