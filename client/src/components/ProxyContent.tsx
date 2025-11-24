import { Rocket, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProxyContentProps {
  status: "empty" | "loading" | "loaded" | "error";
  url?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onExampleClick?: (url: string) => void;
}

export default function ProxyContent({
  status,
  url,
  errorMessage,
  onRetry,
  onExampleClick,
}: ProxyContentProps) {
  if (status === "empty") {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="relative mb-6">
            <Rocket className="h-20 w-20 text-primary" />
            <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Brooks's BW Proxy Browser
          </h1>
          <p className="text-muted-foreground mb-6">
            Launch into any website through secure proxy
          </p>
          
          {onExampleClick && (
            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-3">Quick start example:</p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => onExampleClick("https://sites.google.com/students.wcpss.net/unblockedbw")}
                  className="font-mono text-xs"
                  data-testid="button-example-1"
                >
                  https://sites.google.com/students.wcpss.net/unblockedbw
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
          {url && (
            <p className="text-xs text-muted-foreground font-mono max-w-md truncate">
              {url}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="max-w-md p-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load</h2>
            <p className="text-muted-foreground mb-4">
              {errorMessage || "Unable to load the requested page through the proxy."}
            </p>
            {url && (
              <p className="text-xs text-muted-foreground font-mono mb-4 break-all">
                {url}
              </p>
            )}
            {onRetry && (
              <Button onClick={onRetry} data-testid="button-retry">
                Try Again
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (status === "loaded" && url) {
    return (
      <div className="h-full w-full">
        <iframe
          src={`/api/proxy?url=${encodeURIComponent(url)}`}
          className="h-full w-full border-0"
          title="Proxied Content"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          data-testid="iframe-content"
        />
      </div>
    );
  }

  return null;
}
