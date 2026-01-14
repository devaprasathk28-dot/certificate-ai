import { Link, useLocation } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b border-secondary/10 sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-secondary">
              CertiVault AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`font-paragraph text-sm transition-colors ${
                isActive('/') ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'
              }`}
            >
              HOME
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`font-paragraph text-sm transition-colors ${
                    isActive('/dashboard') ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'
                  }`}
                >
                  DASHBOARD
                </Link>
                <Link
                  to="/vault"
                  className={`font-paragraph text-sm transition-colors ${
                    isActive('/vault') ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'
                  }`}
                >
                  VAULT
                </Link>
                <Link
                  to="/skills"
                  className={`font-paragraph text-sm transition-colors ${
                    isActive('/skills') ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'
                  }`}
                >
                  SKILLS
                </Link>
                <Link
                  to="/careers"
                  className={`font-paragraph text-sm transition-colors ${
                    isActive('/careers') ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'
                  }`}
                >
                  CAREERS
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoading ? (
              <div className="w-20 h-10 bg-secondary/5 animate-pulse rounded"></div>
            ) : isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="font-paragraph text-sm">
                    {member?.profile?.nickname || member?.contact?.firstName || 'Profile'}
                  </Button>
                </Link>
                <Button
                  onClick={actions.logout}
                  variant="outline"
                  className="font-paragraph text-sm border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={actions.login}
                className="font-paragraph text-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-secondary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-secondary/10">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-sm py-2 ${
                  isActive('/') ? 'text-primary font-semibold' : 'text-secondary'
                }`}
              >
                HOME
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm py-2 ${
                      isActive('/dashboard') ? 'text-primary font-semibold' : 'text-secondary'
                    }`}
                  >
                    DASHBOARD
                  </Link>
                  <Link
                    to="/vault"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm py-2 ${
                      isActive('/vault') ? 'text-primary font-semibold' : 'text-secondary'
                    }`}
                  >
                    VAULT
                  </Link>
                  <Link
                    to="/skills"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm py-2 ${
                      isActive('/skills') ? 'text-primary font-semibold' : 'text-secondary'
                    }`}
                  >
                    SKILLS
                  </Link>
                  <Link
                    to="/careers"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm py-2 ${
                      isActive('/careers') ? 'text-primary font-semibold' : 'text-secondary'
                    }`}
                  >
                    CAREERS
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-paragraph text-sm py-2 text-secondary"
                  >
                    Profile
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-secondary/10">
                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      actions.logout();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full font-paragraph text-sm border-secondary text-secondary"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      actions.login();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full font-paragraph text-sm bg-primary text-primary-foreground"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
