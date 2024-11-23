import {Hero} from "@/app/_components/home/hero";
import { PropertySearch } from "@/app/_components/home/property-search";
import { NewProperties } from "@/app/_components/home/new-properties";
import {Faq} from "@/app/_components/home/faq";
import {ArticlesGrid} from "@/app/_components/home/articles-grid";

export default function HomePage() {
  return (
    <div className="min-h-screen  bg-gradient-to-b from-white to-gray-100">
      <Hero />
      <div className="container mx-auto px-4 pb-12">
        <PropertySearch />
        <NewProperties />
        <ArticlesGrid />
        <Faq />
      </div>
    </div>
  );
}
