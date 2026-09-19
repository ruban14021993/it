import Image from "next/image";
import Link from "next/link";
import type { HomepageSection } from "@/lib/types";
import { mediaUrl } from "@/lib/utils";

interface Props {
  sections: HomepageSection[];
}

export default function HomepageSectionsBlock({ sections }: Props) {
  return (
    <div className="py-8">
      {sections.map((section, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <section
            key={section.id}
            className={`py-16 ${isEven ? "bg-white" : "bg-slate-50"}`}
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div
                className={`flex flex-col lg:flex-row gap-10 items-center ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {section.image && (
                  <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-md">
                    <Image
                      src={mediaUrl(section.image.storage_path)}
                      alt={section.image.alt_text || section.title}
                      width={640}
                      height={400}
                      className="w-full h-64 lg:h-80 object-cover"
                    />
                  </div>
                )}
                <div className={`w-full ${section.image ? "lg:w-1/2" : "max-w-3xl mx-auto text-center"}`}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {section.description}
                    </p>
                  )}
                  {section.cta_text && section.cta_url && section.cta_url !== "#" && (
                    <Link
                      href={section.cta_url}
                      className="inline-block px-6 py-2.5 rounded-full font-semibold text-white gradient-bg hover:opacity-90 transition-opacity text-sm"
                    >
                      {section.cta_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
