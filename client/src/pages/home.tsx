import { useState } from "react";
import ProxyToolbar from "@/components/ProxyToolbar";
import ProxyContent from "@/components/ProxyContent";
import SpaceBackground from "@/components/SpaceBackground";

type ContentStatus = "empty" | "loading" | "loaded" | "error";

export default function Home() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [status, setStatus] = useState<ContentStatus>("empty");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleNavigate = (url: string) => {
    setStatus("loading");
    setCurrentUrl(url);
    
    const newHistory = [...history.slice(0, historyIndex + 1), url];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setTimeout(() => {
      setStatus("loaded");
    }, 500);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setStatus("loaded");
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setStatus("loaded");
    }
  };

  const handleReload = () => {
    if (currentUrl) {
      setStatus("loading");
      setTimeout(() => {
        setStatus("loaded");
      }, 500);
    }
  };

  const handleHome = () => {
    setCurrentUrl("");
    setStatus("empty");
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleExampleClick = (url: string) => {
    handleNavigate(url);
  };

  const handleRetry = () => {
    handleReload();
  };

  return (
    <div className="flex h-screen flex-col">
      <SpaceBackground />
      <ProxyToolbar
        onNavigate={handleNavigate}
        onBack={handleBack}
        onForward={handleForward}
        onReload={handleReload}
        onHome={handleHome}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        currentUrl={currentUrl}
      />
      <main className="relative flex-1 overflow-hidden">
        <ProxyContent
          status={status}
          url={currentUrl}
          onRetry={handleRetry}
          onExampleClick={handleExampleClick}
        />
      </main>
    </div>
  );
}
