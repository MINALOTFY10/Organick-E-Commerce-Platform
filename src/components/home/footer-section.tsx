import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/img/Logo.svg";

const SOCIAL_LINKS = [
  { id: "fb", label: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { id: "ig", label: "Instagram", icon: "M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5a4.25 4.25 0 00-4.25 4.25v8.5a4.25 4.25 0 004.25 4.25h8.5a4.25 4.25 0 004.25-4.25v-8.5a4.25 4.25 0 00-4.25-4.25h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-2.75a1 1 0 110 2 1 1 0 010-2z" },
  { id: "tw", label: "Twitter", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
  { id: "pt", label: "Pinterest", icon: "M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.599-.299-1.484c0-1.39.805-2.427 1.808-2.427.852 0 1.264.64 1.264 1.407 0 .857-.546 2.14-.828 3.328-.235.992.499 1.802 1.475 1.802 1.77 0 3.13-1.867 3.13-4.562 0-2.384-1.713-4.053-4.16-4.053-2.835 0-4.499 2.126-4.499 4.324 0 .856.33 1.774.741 2.274a.3.3 0 01.07.288c-.026.105-.083.342-.094.388-.014.062-.047.075-.11.046-1.03-.48-1.674-1.984-1.674-3.193 0-2.6 1.889-4.987 5.447-4.987 2.859 0 5.082 2.037 5.082 4.761 0 2.841-1.79 5.127-4.275 5.127-.835 0-1.62-.434-1.888-.947 0 0-.413 1.573-.514 1.957-.185.713-.687 1.607-1.022 2.153C10.05 21.84 11.002 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" },
];

export default function FooterSection() {
  return (
    <footer className="w-full bg-white pt-6 md:pt-8 pb-5 md:pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-8 md:gap-10 items-start text-[#274c5b]">
          
          {/* Left Column: Contact Us */}
          <div className="order-2 md:order-1 md:col-span-3 text-center md:text-right space-y-4">
            <h4 className="text-lg md:text-xl font-semibold tracking-tight">Contact Us</h4>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm uppercase tracking-wide text-[#274c5b]">Email</h5>
              <p className="text-sm text-[#525c60]">support@organick.com</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm uppercase tracking-wide text-[#274c5b]">Phone</h5>
              <p className="text-sm text-[#525c60]">+1 (555) 123-4567</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-sm uppercase tracking-wide text-[#274c5b]">Address</h5>
              <p className="text-sm text-[#525c60]">123 Green Lane, Brooklyn, NY, USA</p>
            </div>
          </div>

          {/* Center Column: Logo & Social */}
          <div className="order-1 md:order-2 md:col-span-5 flex flex-col items-center text-center px-3 md:px-6 md:border-x border-[#e4e4e4]">
            <div className="mb-4">
              <Image src={Logo} alt="Organick Logo" width={124} height={44} className="object-contain" />
            </div>
            <p className="text-sm text-[#525c60] max-w-xs md:max-w-sm leading-relaxed">
              Organick delivers thoughtfully sourced organic produce with quality, freshness, and sustainability at the heart of every order.
            </p>

            <div className="flex justify-center gap-2.5 mt-5">
              {SOCIAL_LINKS.map((link) => (
                <a key={link.id} href="#" target="_blank" rel="noopener noreferrer" aria-label={link.label} className="grid place-items-center size-9 bg-[#eff6f1] rounded-full border border-transparent hover:border-[#d7e6de] hover:bg-[#e7f1ea] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondary-color)">
                  <svg className="w-4 h-4 fill-(--primary-color)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d={link.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Utility Pages */}
          <div className="max-sm:hidden order-3 md:order-3 md:col-span-3 text-center md:text-left">
            <h4 className="text-lg md:text-xl font-semibold tracking-tight mb-4">Quick Links</h4>
            <nav aria-label="Quick links">
              <ul className="space-y-2.5 text-sm text-[#525c60]">
                <li><Link href="/about" className="inline-flex hover:text-(--secondary-color) transition-colors duration-200">About Us</Link></li>
                <li><Link href="/products" className="inline-flex hover:text-(--secondary-color) transition-colors duration-200">Shop</Link></li>
                <li><Link href="/blog" className="inline-flex hover:text-(--secondary-color) transition-colors duration-200">Blog</Link></li>
                <li><Link href="/service" className="inline-flex hover:text-(--secondary-color) transition-colors duration-200">Services</Link></li>
                <li><Link href="/contact" className="inline-flex hover:text-(--secondary-color) transition-colors duration-200">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 md:mt-10 pt-4 border-t border-[#e5e5e5] text-center text-xs md:text-sm text-[#525c60]">
          <p>
            © {new Date().getFullYear()} <strong>Organick</strong>. Crafted with care by <strong className="text-[#274c5b]">Mina Lotfy</strong>.
          </p>
        </div>
      </div>
    </footer>
  );
};

