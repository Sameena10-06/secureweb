import { Shield, Github, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-foreground">
                Secure<span className="text-primary">Vault</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building secure applications with industry-standard cybersecurity practices.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Security</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/demos" className="hover:text-primary transition-colors">XSS Protection</Link></li>
              <li><Link to="/demos" className="hover:text-primary transition-colors">SQL Injection</Link></li>
              <li><Link to="/demos" className="hover:text-primary transition-colors">Encryption</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Authentication</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://owasp.org" target="_blank" rel="noopener" className="hover:text-primary transition-colors">OWASP Guidelines</a></li>
              <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security" target="_blank" rel="noopener" className="hover:text-primary transition-colors">MDN Web Security</a></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Security Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SecureVault. Built with security in mind.</p>
        </div>
      </div>
    </footer>
  );
}
