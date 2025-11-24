import ProxyToolbar from "../ProxyToolbar";

export default function ProxyToolbarExample() {
  return (
    <ProxyToolbar
      onNavigate={(url) => console.log("Navigate to:", url)}
      onBack={() => console.log("Go back")}
      onForward={() => console.log("Go forward")}
      onReload={() => console.log("Reload")}
      onHome={() => console.log("Go home")}
      canGoBack={true}
      canGoForward={false}
      currentUrl="https://example.com"
    />
  );
}
