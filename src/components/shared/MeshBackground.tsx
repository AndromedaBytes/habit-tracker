export interface MeshBackgroundProps {
  className?: string;
}

export const MeshBackground = ({ className }: MeshBackgroundProps) => {
  return (
    <div className={className}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg-0">
        <div className="absolute -left-28 -top-40 h-[650px] w-[650px] animate-drift rounded-full bg-[radial-gradient(circle,#3d2c8d,transparent_70%)] opacity-15 blur-[110px]" />
        <div className="absolute -bottom-28 -right-24 h-[520px] w-[520px] animate-drift-slow rounded-full bg-[radial-gradient(circle,#0a3d62,transparent_70%)] opacity-15 blur-[110px]" />
        <div className="absolute left-[42%] top-[38%] h-[420px] w-[420px] animate-drift-xslow rounded-full bg-[radial-gradient(circle,#1a0050,transparent_70%)] opacity-10 blur-[110px]" />
      </div>
    </div>
  );
};
