export const metadata = { title: "Search Terms Cleaner" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 20, maxWidth: 900, margin: "0 auto" }}>
        {children}
      </body>
    </html>
  );
}
