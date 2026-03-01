import { useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Menu, X, Package, LogIn, LogOut } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Track Parcel', path: '/track' },
    { name: 'Contact', path: '/contact' },
  ];

  if (isAuthenticated && isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin' });
  }

  const isActive = (path: string) => currentPath === path;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Logged out successfully');
      if (currentPath === '/admin') {
        navigate({ to: '/' });
      }
    } else {
      try {
        await login();
        toast.success('Logged in successfully');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Login failed');
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary">SwiftDrop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.path) ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            onClick={handleAuth}
            disabled={disabled}
            className="gap-2"
          >
            {disabled ? (
              'Loading...'
            ) : isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Login
              </>
            )}
          </Button>
          <Button onClick={() => navigate({ to: '/contact' })}>Get a Quote</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              onClick={() => {
                handleAuth();
                setMobileMenuOpen(false);
              }}
              disabled={disabled}
              className="w-full gap-2"
            >
              {disabled ? (
                'Loading...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                navigate({ to: '/contact' });
                setMobileMenuOpen(false);
              }}
              className="w-full"
            >
              Get a Quote
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
