// app/ai-suite/layout.tsx
import { Header, Footer } from "../components";

export const metadata = {
  title: "AI Suite ",
  description: "Command center untuk mengubah imajinasi Anda menjadi kenyataan visual.",
};

export default function AISuiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900">
      <Header />
      {children}
      <Footer />
    </div>
  );
}