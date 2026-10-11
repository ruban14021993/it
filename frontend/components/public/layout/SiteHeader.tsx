"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Box, LayoutGrid } from "lucide-react";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  navItems: NavItem[];
}

export default function SiteHeader({ navItems }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100 shadow-sm flex flex-col">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0a82bd] via-[#00a56f] via-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(10,130,189,0.3)]"></div>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-20 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md">
          <Image src="/images/logo.jpg" alt="InfinityMind Tech" width={240} height={64} className="h-12 lg:h-14 w-auto object-contain" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center h-full gap-2" aria-label="Main Navigation">
          {navItems.map((item) =>
            item.children && item.children.length > 0 ? (
              <DropdownItem key={item.id} item={item} />
            ) : (
              <Link
                key={item.id}
                href={item.url}
                target={item.target}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-gray-700 rounded-md transition-all",
                  "hover:text-[#0a82bd] hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-[#0a82bd] focus:text-[#0a82bd]",
                  item.label === "Contact" ? "ml-4 bg-gradient-to-r from-[#0a82bd] to-[#00a56f] text-white hover:from-[#086a9a] hover:to-[#008257] hover:text-white shadow-md shadow-blue-500/20 border-0" : ""
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden absolute top-[5.375rem] left-0 right-0 bg-white border-b border-gray-100 shadow-lg px-4 py-4 max-h-[calc(100vh-5.375rem)] overflow-y-auto"
        >
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {navItems.map((item) => (
              <div key={item.id} className="flex flex-col border-b border-gray-50 last:border-0 pb-1 mb-1 last:mb-0 last:pb-0">
                <Link
                  href={item.url}
                  className={cn(
                    "block px-3 py-3 text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors",
                    item.label === "Contact" ? "bg-blue-50 text-blue-700 mt-2" : ""
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.length > 0 && (
                  <div className="pl-4 pr-2 py-1 space-y-1 bg-gray-50/50 rounded-md mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.url}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-white rounded-md transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function DropdownItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMega = Boolean(item.children && item.children.length > 5);
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 250);
  };

  // Handle keyboard focus to open/close menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      className={cn("group h-full flex items-center", !isMega && "relative")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 group-hover:text-[#0a82bd] group-hover:bg-blue-50/50 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-[#0a82bd] focus:text-[#0a82bd]"
        aria-expanded={open}
        aria-haspopup="true"
        onKeyDown={handleKeyDown}
      >
        {item.label}
        <ChevronDown 
          size={16} 
          className={cn("transition-transform duration-200", open && "rotate-180")} 
          aria-hidden="true"
        />
      </button>
      
      {open && (
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "absolute top-full pt-1 z-50",
            isMega 
              ? "left-1/2 -translate-x-1/2 w-[95vw] max-w-[960px]" 
              : "left-0 w-56"
          )}
        >
          <div className={cn(
            "bg-white rounded-xl shadow-2xl border border-gray-100 p-6 animate-in fade-in slide-in-from-top-2",
            isMega 
              ? "max-h-[75vh] overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2.5" 
              : "flex flex-col space-y-1"
          )}>
            {item.children.map((child, idx) => (
              <Link
                key={child.id}
                href={child.url}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#0a82bd] hover:bg-blue-50/50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#0a82bd] group/item"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 group-hover/item:bg-gradient-to-br group-hover/item:from-[#0a82bd] group-hover/item:to-[#00a56f] group-hover/item:text-white transition-all shadow-sm">
                  {idx % 2 === 0 ? <Box size={16} /> : <LayoutGrid size={16} />}
                </div>
                <span className="leading-snug">{child.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


