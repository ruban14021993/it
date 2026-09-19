"use client";

import { useState } from "react";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    // Simulate frontend-only submission behavior
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear specific error when user starts typing again
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <CheckCircle2 size={32} className="text-emerald-500" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Validation Successful</h3>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          This is a frontend-only demonstration. Form submission will be connected to the backend API in a future phase. No data has been submitted.
        </p>
        <button
          onClick={() => {
            setFormData({ name: "", email: "", phone: "", message: "" });
            setStatus("idle");
          }}
          className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
            placeholder="John Doe"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" aria-hidden="true" /> {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
            placeholder="john@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" aria-hidden="true" /> {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
            Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-shadow resize-none`}
            placeholder="How can we help you?"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" aria-hidden="true" /> {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
        >
          {status === "submitting" ? "Validating..." : "Send Message"}
          {status !== "submitting" && <Send size={18} className="ml-2" aria-hidden="true" />}
        </button>
      </form>
    </div>
  );
}
