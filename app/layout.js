import "./globals.css";

export const metadata = {
  title: "Enfinito — WhatsApp API Platform",
  description: "Send and receive WhatsApp messages through a single secure API.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
