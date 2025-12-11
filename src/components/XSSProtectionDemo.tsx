import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Check, Code } from "lucide-react";
import { cn } from "@/lib/utils";

// Sanitize HTML to prevent XSS
function sanitizeHTML(input: string): string {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

export function XSSProtectionDemo() {
  const [userInput, setUserInput] = useState("");
  const [showComparison, setShowComparison] = useState(false);

  const handleTest = () => {
    setShowComparison(true);
  };

  const dangerousExamples = [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(\'XSS\')">',
    '<a href="javascript:alert(\'XSS\')">Click me</a>',
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          XSS Protection Demo
        </CardTitle>
        <CardDescription>
          Learn how input sanitization prevents Cross-Site Scripting attacks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Try entering HTML/JavaScript:
            </label>
            <Input
              placeholder='Try: <script>alert("XSS")</script>'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>

          <Button onClick={handleTest} variant="cyber" className="w-full">
            <Code className="w-4 h-4 mr-2" />
            Test Input Handling
          </Button>
        </div>

        {showComparison && userInput && (
          <div className="grid gap-4 animate-fade-in">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium text-sm">Vulnerable (Raw HTML)</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Without sanitization, malicious code could execute:
              </p>
              <code className="text-xs font-mono bg-destructive/20 p-2 rounded block break-all">
                {userInput}
              </code>
            </div>

            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-2 text-success mb-2">
                <Check className="w-4 h-4" />
                <span className="font-medium text-sm">Protected (Sanitized)</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                With proper sanitization, code is escaped safely:
              </p>
              <code className="text-xs font-mono bg-success/20 p-2 rounded block break-all">
                {sanitizeHTML(userInput)}
              </code>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Common XSS Attack Patterns:</h4>
          <div className="space-y-2">
            {dangerousExamples.map((example, i) => (
              <button
                key={i}
                onClick={() => setUserInput(example)}
                className="w-full text-left p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
              >
                <code className="text-xs font-mono text-muted-foreground">
                  {example}
                </code>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">Prevention Tips:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Always sanitize user input before rendering</li>
            <li>• Use textContent instead of innerHTML when possible</li>
            <li>• Implement Content Security Policy (CSP) headers</li>
            <li>• Use libraries like DOMPurify for complex HTML</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
