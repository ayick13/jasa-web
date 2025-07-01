<<<<<<< HEAD
// app/blog/layout.tsx
=======
>>>>>>> d9434bf (fix: perbaiki header/footer ganda dan konversi artikel ke markdown)

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  // Cukup kembalikan 'children' agar header dan footer dari
  // tata letak utama (root layout) yang membungkusnya.
  return <>{children}</>;
}
=======
  return (
    <main className="flex-grow">
      {children}
    </main>
  );
}
>>>>>>> d9434bf (fix: perbaiki header/footer ganda dan konversi artikel ke markdown)
