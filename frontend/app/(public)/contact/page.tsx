import type { Metadata } from "next";
import { getContact } from "@/lib/api/public";
import ContactInfo from "@/components/public/contact/ContactInfo";
import ContactForm from "@/components/public/contact/ContactForm";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact | InfinityMind Tech",
  description: "Contact InfinityMind Tech for your technology requirements and enquiries.",
};

export default async function ContactPage() {
  const contactData = await getContact();

  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-28 pb-10 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Contact InfinityMind Tech for your technology requirements and enquiries.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            <div className="flex-1 lg:max-w-md">
              {contactData ? (
                <ContactInfo settings={contactData.settings} branches={contactData.branches} />
              ) : (
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center text-slate-500">
                  Contact information is currently unavailable.
                </div>
              )}
            </div>

            <div className="flex-[1.5]">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      <FinalCTASection 
        content={{
          headline: "Explore Our Solutions",
          description: "Discover how InfinityMind Tech can transform your business with cutting-edge technology.",
          primary_cta_text: "View Services",
          primary_cta_url: "/services",
        }} 
      />
    </div>
  );
}
