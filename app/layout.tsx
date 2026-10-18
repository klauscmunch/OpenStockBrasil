import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import {Toaster} from "@/components/ui/sonner";
import OntoLaunchCard from "@/components/OntoLaunchCard";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "OpenStock",
  description: "OpenStock é uma alternativa open source às plataformas de mercado caras. Acompanhe preços em tempo real, crie alertas personalizados e explore informações detalhadas das empresas — feito de forma aberta, para todos, gratuito para sempre.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark">
            <body
                className={`${jakarta.variable} ${plexMono.variable} font-sans antialiased`}
            >
                {children}
                <Toaster/>
                <OntoLaunchCard />
                <Analytics />
            </body>
        </html>
    );
}
