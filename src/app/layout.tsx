import "./globals.css";

export const metadata = {
  title: "RentHub Notes",
  description: "Notes from NeonDB",
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
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
