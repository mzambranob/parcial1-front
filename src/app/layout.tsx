import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ActorsProvider } from "@/context/ActorsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arte7",
  description: "CRUD de actores",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="bg-gray-900 text-white px-6 py-3 flex gap-6">
          <span className="font-bold">Arte7</span>
          <Link href="/actors" className="hover:underline">Actores</Link>
          <Link href="/peliculas" className="hover:underline">Películas</Link>
          <Link href="/peliculas/crear" className="hover:underline">Crear Película</Link>
        </nav>
        <ActorsProvider>{children}</ActorsProvider>
      </body>
    </html>
  );
}
