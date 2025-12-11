import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database, AlertTriangle, Check, Search } from "lucide-react";

export function SQLInjectionDemo() {
  const [username, setUsername] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
  };

  const vulnerableQuery = `SELECT * FROM users WHERE username = '${username}'`;
  
  // Simulated parameterized query (safe)
  const safeQuery = `SELECT * FROM users WHERE username = $1`;
  const safeParams = `Parameters: ['${username.replace(/'/g, "''")}']`;

  const injectionExamples = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM passwords --",
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          SQL Injection Demo
        </CardTitle>
        <CardDescription>
          Understand how parameterized queries prevent SQL injection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Search by username:
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter username to search..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button onClick={handleSearch} variant="cyber">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {showResults && username && (
          <div className="grid gap-4 animate-fade-in">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium text-sm">Vulnerable Query (String Concatenation)</span>
              </div>
              <code className="text-xs font-mono bg-destructive/20 p-3 rounded block break-all text-destructive">
                {vulnerableQuery}
              </code>
              {username.includes("'") && (
                <p className="text-xs text-destructive mt-2">
                  ⚠️ This input could manipulate the query!
                </p>
              )}
            </div>

            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-2 text-success mb-2">
                <Check className="w-4 h-4" />
                <span className="font-medium text-sm">Safe Query (Parameterized)</span>
              </div>
              <code className="text-xs font-mono bg-success/20 p-3 rounded block mb-2 text-success">
                {safeQuery}
              </code>
              <code className="text-xs font-mono bg-success/10 p-2 rounded block text-success/80">
                {safeParams}
              </code>
              <p className="text-xs text-success mt-2">
                ✓ Input is treated as data, not code
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Try These Injection Examples:</h4>
          <div className="space-y-2">
            {injectionExamples.map((example, i) => (
              <button
                key={i}
                onClick={() => setUsername(example)}
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
          <h4 className="text-sm font-medium text-foreground mb-2">Prevention Best Practices:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Always use parameterized queries or prepared statements</li>
            <li>• Use ORMs that handle query escaping automatically</li>
            <li>• Validate and sanitize all user inputs</li>
            <li>• Apply principle of least privilege to database accounts</li>
            <li>• Implement Web Application Firewalls (WAF)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
