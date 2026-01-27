import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata = {
  title: "RentHub - Каталог аренды недвижимости",
  description: "Найдите идеальное жилье для аренды. Квартиры, дома, комнаты и коммерческая недвижимость.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="overflow-x-hidden">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden">
        <div className="flex min-h-screen flex-col overflow-x-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
