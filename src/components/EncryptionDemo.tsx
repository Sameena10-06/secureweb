import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Unlock, Copy, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Simple Base64 encoding for demonstration (NOT secure encryption!)
// In production, use proper encryption libraries like Web Crypto API
function simpleEncrypt(text: string, key: string): string {
  const combined = text.split("").map((char, i) => {
    const keyChar = key[i % key.length];
    return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
  }).join("");
  return btoa(combined);
}

function simpleDecrypt(encrypted: string, key: string): string {
  try {
    const decoded = atob(encrypted);
    return decoded.split("").map((char, i) => {
      const keyChar = key[i % key.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join("");
  } catch {
    return "Invalid encrypted data";
  }
}

export function EncryptionDemo() {
  const [plainText, setPlainText] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEncrypt = () => {
    if (!plainText || !encryptionKey) {
      toast.error("Please enter both text and encryption key");
      return;
    }
    const encrypted = simpleEncrypt(plainText, encryptionKey);
    setEncryptedText(encrypted);
    setDecryptedText("");
    toast.success("Text encrypted successfully");
  };

  const handleDecrypt = () => {
    if (!encryptedText || !encryptionKey) {
      toast.error("Please enter both encrypted text and key");
      return;
    }
    const decrypted = simpleDecrypt(encryptedText, encryptionKey);
    setDecryptedText(decrypted);
    toast.success("Text decrypted successfully");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encryptedText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Encryption Demo
        </CardTitle>
        <CardDescription>
          Experience how encryption protects sensitive data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Plain Text</label>
            <Input
              placeholder="Enter text to encrypt..."
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Encryption Key</label>
            <Input
              type="password"
              placeholder="Enter secret key..."
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Keep this key secret! It's required for both encryption and decryption.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleEncrypt} className="flex-1" variant="cyber">
            <Lock className="w-4 h-4 mr-2" />
            Encrypt
          </Button>
          <Button onClick={handleDecrypt} className="flex-1" variant="outline">
            <Unlock className="w-4 h-4 mr-2" />
            Decrypt
          </Button>
        </div>

        {encryptedText && (
          <div className="space-y-2 animate-fade-in">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-primary" />
              Encrypted Result
            </label>
            <div className="relative">
              <div className="font-mono text-sm bg-secondary/50 p-4 rounded-lg border border-border break-all">
                {encryptedText}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {decryptedText && (
          <div className="space-y-2 animate-fade-in">
            <label className="text-sm font-medium text-success flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              Decrypted Result
            </label>
            <div className="font-mono text-sm bg-success/10 p-4 rounded-lg border border-success/30">
              {decryptedText}
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> This is a simplified XOR cipher for demonstration. 
            Production systems should use industry-standard algorithms like AES-256-GCM via the Web Crypto API.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
