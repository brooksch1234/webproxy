import SpaceBackground from "../SpaceBackground";

export default function SpaceBackgroundExample() {
  return (
    <div className="relative h-screen">
      <SpaceBackground />
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-4xl font-bold text-foreground">Space Theme</h1>
      </div>
    </div>
  );
}
