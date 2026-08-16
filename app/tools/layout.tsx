export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto w-full px-5 sm:px-6 py-10 sm:py-14">
      {children}
    </div>
  );
}
