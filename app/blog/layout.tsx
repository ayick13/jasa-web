// app/blog/layout.tsx

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cukup kembalikan 'children' agar header dan footer dari
  // tata letak utama (root layout) yang membungkusnya.
  return <>{children}</>;
}
