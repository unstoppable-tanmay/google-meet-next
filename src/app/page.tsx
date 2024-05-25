import Home from "@/components/Home";
import Nav from "@/components/Nav";
import Settings from "@/components/common/Settings";
import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col relative">
      <Nav />
      <Home />
      <Settings/>
    </main>
  );
}
