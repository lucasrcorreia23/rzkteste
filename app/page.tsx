import Cotacao from "@/src/componente/cotacao";
import Image from "next/image";
import "./globals.css";

export default function Home() {
  return (
   
       <main className=" flex mx-auto p-4 lg:p-20 flex-col items-center justify-between ">
     
       
        <Cotacao />
     
    </main>
   
  );
}
