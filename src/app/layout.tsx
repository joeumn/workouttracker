import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IronCircle - Fitness Community & Tracker",
  description: "Track your workouts, nutrition, and connect with fitness enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
