import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import Banner from '@/components/site/Banner';
import Sidebar from '@/components/site/Sidebar';
import ToTopCat from '@/components/site/ToTopCat';
import EvanyouBackground from '@/components/effects/EvanyouBackground';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <EvanyouBackground />
      <Header />
      <Banner />
      <div className="mx-auto mt-20 grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 md:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 pl-5">{children}</main>
        <Sidebar />
      </div>
      <Footer />
      <ToTopCat />
    </div>
  );
}
