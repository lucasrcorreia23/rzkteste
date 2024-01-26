import type { Metadata } from "next";

import "./globals.css";
import "@/src/output.css";


import Header from "@/src/componente/header";
import Footer from "@/src/componente/footer";
import Link from "next/link";



export const metadata: Metadata = {
  title: "Dashboard - Cotacao",
  description: "Teste de dash com API para cotacao: dolar, euro e bitcoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      
      <body className=" overflow-y-auto " >
        <Header />
       <>
          {children}
          </>
        <Footer />
      </body>
    </html>
  );
}
