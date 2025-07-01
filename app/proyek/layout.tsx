
export default function ProyekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-grow">
      {children}
    </main>
  );
}
