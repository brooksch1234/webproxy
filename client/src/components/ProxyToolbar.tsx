import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, X } from "lucide-react";

interface ProxyToolbarProps {
  onNavigate: (url: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  onReload?: () => void;
  onHome?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  currentUrl?: string;
}

export default function ProxyToolbar({
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  canGoBack = false,
  canGoForward = false,
  currentUrl = "",
}: ProxyToolbarProps) {
  const [inputUrl, setInputUrl] = useState(currentUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      let url = inputUrl.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      onNavigate(url);
    }
  };

  const handleClear = () => {
    setInputUrl("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-md">
      <div className="flex items-center gap-2 p-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onBack}
            disabled={!canGoBack}
            aria-label="Go back"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onForward}
            disabled={!canGoForward}
            aria-label="Go forward"
            data-testid="button-forward"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onReload}
            aria-label="Reload"
            data-testid="button-reload"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onHome}
            aria-label="Home"
            data-testid="button-home"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL to browse through proxy..."
              className="w-full rounded-lg pl-10 pr-10 font-mono text-sm"
              autoFocus
              data-testid="input-url"
            />
            {inputUrl && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleClear}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                aria-label="Clear URL"
                data-testid="button-clear"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}
