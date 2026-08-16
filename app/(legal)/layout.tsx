export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto w-full px-5 sm:px-6 py-14 sm:py-20 legal-prose">
      {children}
    </div>
  );
}
