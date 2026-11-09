import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
} from "lucide-react";
import { submitContactApi } from "../services/api";

export default function ContactUs() {
  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const [name, setName] = useState(loggedInUser?.name || "");
  const [email, setEmail] = useState(loggedInUser?.email || "");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in your name, email, and message.");
      return;
    }

    setLoading(true);

    try {
      const res = await submitContactApi({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
      });

      setSuccessMsg(
        res?.message ||
        "Thank you for contacting HackMate! Your message has been submitted successfully."
      );
      setMessage("");
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
        "Failed to send your message. Please try again or email us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@hackmate.com",
      desc: "Our team typically responds within 24 hours.",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      icon: Phone,
      title: "Phone & WhatsApp",
      value: "+91 98765 43210",
      desc: "Available Monday to Saturday, 9am - 7pm IST.",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      icon: MapPin,
      title: "Campus / Office",
      value: "CDAC- Kharghar",
      desc: "Mumbai",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      value: "Mon - Sat: 9:00 AM - 7:00 PM",
      desc: "Weekend support available during live hackathons.",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
  ];

  const faqs = [
    {
      q: "How do I find a team for a hackathon?",
      a: "Navigate to the Teams page to browse open squads looking for members, or create your own team and set required skills.",
    },
    {
      q: "Can college organizers partner with HackMate?",
      a: "Yes! Choose 'Hackathon Partnership' in the contact form, and we'll help onboard your event and participants.",
    },
    {
      q: "Is HackMate free to use?",
      a: "HackMate is 100% free for students, developers, and collegiate hackathon participants.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">
        {/* Header Section */}
        <section className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-semibold">
            Support & Help Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Contact HackMate Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
            Have questions about finding teammates, hosting your college hackathon, or feature requests? Drop us a message below.
          </p>
        </section>

        {/* 2-Column Grid: Left Info & FAQ, Right Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Contact Cards & FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-start gap-3.5"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border shrink-0 ${info.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-gray-900">{info.title}</h2>
                      <p className="text-xs font-semibold text-purple-950 mt-0.5">
                        {info.value}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{info.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick FAQs */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="w-4 h-4 text-purple-700" />
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs font-semibold text-gray-800">{faq.q}</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-base font-bold text-gray-900">Send Us a Message</h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill out the form below. We respond to all inquiries within 24 hours.
              </p>
            </div>

            {successMsg && (
              <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Message Sent Successfully!</p>
                  <p className="text-[11px] text-green-700 mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Submission Error</p>
                  <p className="text-[11px] text-red-600 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-purple-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-purple-700"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-purple-700 cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Hackathon Partnership">Hackathon Partnership / Host an Event</option>
                  <option value="Feature Request">Feature Request / Suggestion</option>
                  <option value="Technical Support">Technical Support / Bug Report</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what's on your mind, how we can help, or details about your hackathon..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-purple-700 leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#A54100] hover:bg-[#8A3600] text-white font-semibold text-xs py-2.5 px-6 rounded-xl transition-colors shadow-2xs flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending Message..." : "Send Message"}</span>
                </button>

                <p className="text-[11px] text-gray-400">
                  Protected by HackMate Privacy Policy
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="HackMate" className="w-5 h-5 object-contain" />
            <span className="font-extrabold text-gray-700 tracking-wider">HACKMATE</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <Link to="/dashboard" className="hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/about" className="hover:text-gray-900 transition-colors">
              About Us
            </Link>
            <Link to="/teams" className="hover:text-gray-900 transition-colors">
              Teams
            </Link>
            <Link to="/teammates" className="hover:text-gray-900 transition-colors">
              Teammates
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

