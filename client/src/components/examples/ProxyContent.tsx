import ProxyContent from "../ProxyContent";

export default function ProxyContentExample() {
  return (
    <div className="h-screen">
      <ProxyContent
        status="empty"
        onExampleClick={(url) => console.log("Example clicked:", url)}
      />
    </div>
  );
}
