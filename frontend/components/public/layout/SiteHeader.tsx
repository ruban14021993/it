"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  navItems: NavItem[];
}

export default function SiteHeader({ navItems }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100 shadow-sm h-16">
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-sm group-hover:shadow transition-all">
            <Sparkles size={16} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
            InfinityMind Tech
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-2" aria-label="Main Navigation">
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
                  "hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:text-blue-700 focus:bg-blue-50",
                  item.label === "Contact" ? "ml-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white" : ""
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
          className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto"
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
  
  // Handle keyboard focus to open/close menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!open);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button 
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 group-hover:text-blue-700 group-hover:bg-blue-50 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:text-blue-700 focus:bg-blue-50"
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
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
          {item.children.map((child) => (
            <Link
              key={child.id}
              href={child.url}
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
