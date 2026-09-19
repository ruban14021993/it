import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import { mediaUrl, truncate } from "@/lib/utils";

interface Props {
  product: ProductListItem;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-full"
    >
      <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0">
        {product.hero_image ? (
          <Image
            src={mediaUrl(product.hero_image.storage_path)}
            alt={product.hero_image.alt_text || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 group-hover:bg-slate-100 transition-colors">
            <Box size={48} strokeWidth={1.5} />
          </div>
        )}
        
        {product.category && (
          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md text-blue-600 shadow-sm border border-slate-100">
            {product.category.name}
          </span>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {product.short_description && (
          <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
            {truncate(product.short_description, 100)}
          </p>
        )}
        
        <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
          Learn More 
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
