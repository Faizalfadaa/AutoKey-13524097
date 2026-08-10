import "./globals.css";

// Browser tab information
export const metadata = {
  title: "AutoKey",
};

// Main wrapper for all pages
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
