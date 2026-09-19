import { Mail, Phone, MapPin } from "lucide-react";
import type { ContactSettings, Branch } from "@/lib/types";

interface Props {
  settings: ContactSettings;
  branches: Branch[];
}

export default function ContactInfo({ settings, branches }: Props) {
  return (
    <div className="flex flex-col space-y-12">
      
      {/* General Contact Info */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
        <div className="space-y-6">
          
          {settings.primary_email && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Email Us</div>
                <a href={`mailto:${settings.primary_email}`} className="text-lg text-slate-600 hover:text-blue-600 transition-colors">
                  {settings.primary_email}
                </a>
              </div>
            </div>
          )}

          {settings.primary_phone && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Call Us</div>
                <a href={`tel:${settings.primary_phone.replace(/\s+/g, "")}`} className="text-lg text-slate-600 hover:text-emerald-600 transition-colors">
                  {settings.primary_phone}
                </a>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Branches */}
      {branches && branches.length > 0 && (
        <div className="border-t border-slate-100 pt-10">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Locations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div key={branch.id} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <MapPin size={20} className="text-slate-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-slate-900">
                    {branch.name}
                    {branch.is_primary && (
                      <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        HQ
                      </span>
                    )}
                  </div>
                  {/* Since addresses are not verified, we only display the city/branch name */}
                  <div className="text-sm text-slate-500 mt-1">Regional Office</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
