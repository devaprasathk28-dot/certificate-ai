import { Link } from 'react-router-dom';
import { Shield, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-backgrounddark text-secondary-foreground">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-secondary-foreground">
                CertiVault AI
              </span>
            </div>
            <p className="font-paragraph text-sm text-secondary-foreground/80 leading-relaxed">
              Secure AI-powered platform for certificate management, verification, and career advancement.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-heading text-base font-semibold mb-6 text-secondary-foreground">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/vault"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Certificate Vault
                </Link>
              </li>
              <li>
                <Link
                  to="/skills"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Skills Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Career Recommendations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-base font-semibold mb-6 text-secondary-foreground">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading text-base font-semibold mb-6 text-secondary-foreground">
              Connect
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-secondary-foreground/10 hover:bg-primary rounded-sm flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-secondary-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-foreground/10 hover:bg-primary rounded-sm flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-secondary-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-foreground/10 hover:bg-primary rounded-sm flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-secondary-foreground" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-secondary-foreground/60">
              © {new Date().getFullYear()} CertiVault AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="font-paragraph text-sm text-secondary-foreground/60 hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="font-paragraph text-sm text-secondary-foreground/60 hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
