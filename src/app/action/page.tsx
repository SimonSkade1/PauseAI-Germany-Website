import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { ActionPageContent } from "@/components/action/ActionPageContent";

export default function ActionPage() {
  return (
    <SessionProvider>
      <Header />
      <main className="pt-20">
        <ActionPageContent />
      </main>
      <Footer />
    </SessionProvider>
  );
}
