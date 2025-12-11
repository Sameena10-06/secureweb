import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EncryptionDemo } from "@/components/EncryptionDemo";
import { XSSProtectionDemo } from "@/components/XSSProtectionDemo";
import { SQLInjectionDemo } from "@/components/SQLInjectionDemo";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Key } from "lucide-react";
import { useState } from "react";

export default function Demos() {
  const [testPassword, setTestPassword] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Interactive Demos</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Security Demonstrations
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore hands-on examples of cybersecurity concepts including encryption, 
              XSS protection, and SQL injection prevention.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Password Strength */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Password Strength Tester
                </CardTitle>
                <CardDescription>
                  Test how secure your password is against attacks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Enter a password to test:
                  </label>
                  <Input
                    type="text"
                    placeholder="Type your password..."
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                  />
                </div>
                <PasswordStrengthMeter password={testPassword} />
              </CardContent>
            </Card>

            {/* Encryption Demo */}
            <EncryptionDemo />

            {/* XSS Protection */}
            <XSSProtectionDemo />

            {/* SQL Injection */}
            <SQLInjectionDemo />
          </div>

          {/* OWASP Reference */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      OWASP Top 10 Security Risks
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      This application demonstrates protection against several OWASP Top 10 vulnerabilities:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        A03:2021 - Injection (SQL)
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        A03:2021 - Injection (XSS)
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        A02:2021 - Cryptographic Failures
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        A07:2021 - Identification and Authentication
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
