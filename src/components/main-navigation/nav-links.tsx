"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import CartButton from "@/components/cart/cart-button";
import PrimaryButton from "@/components/ui/primary-button";
import ShopDropdown from "@/components/main-navigation/shop-dropdown";
import NavSearch from "./nav-search";

const MAIN_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "Service", href: "/service" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

interface NavLinksProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  session: { user: { name: string } } | null;
  cartCount: number;
}

const NavLinks = ({ menuOpen, setMenuOpen, session, cartCount }: NavLinksProps) => {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.06, duration: 0.3 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <nav
      id="main-navigation"
      aria-label="Main navigation"
      className={`${
        menuOpen ? "absolute top-full inset-x-0 w-screen lg:w-full bg-white flex flex-col p-6 shadow-lg border-t border-gray-100" : "hidden lg:flex"
      } lg:static lg:bg-transparent lg:flex-row items-center flex-1 lg:shadow-none lg:border-0`}
    >
      <motion.ul
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="flex flex-col lg:flex-row lg:space-x-8 items-center w-full list-none"
        role="list"
      >
        {MAIN_LINKS.map((link) => {
          if (link.name === "Shop") {
            return (
              <motion.li key="shop" variants={itemVars}>
                <ShopDropdown setMenuOpen={setMenuOpen} />
              </motion.li>
            );
          }

          const isActive = pathname === link.href;
          return (
            <motion.li key={link.name} variants={itemVars}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`text-[15px] font-bold transition-colors duration-200 py-3 lg:py-0 relative group inline-block ${
                  isActive ? "text-(--secondary-color)" : "text-(--primary-color) hover:text-(--secondary-color)"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-(--secondary-color) transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </motion.li>
          );
        })}

        {/* Action Section */}
        <motion.li variants={itemVars} className="ms-auto flex items-center gap-3 sm:gap-4 mt-6 lg:mt-0">
          <div className="hidden lg:block">
            <NavSearch onNavigate={() => setMenuOpen(false)} />
          </div>

          {session ?
            <>
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                aria-label="My Account"
                title={session.user.name}
                className="relative flex items-center justify-center w-9 h-9 rounded-full bg-(--primary-color)/10 text-(--primary-color) hover:bg-(--secondary-color)/15 hover:text-(--secondary-color) transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <CartButton cartCount={cartCount} />
            </>
          : <Link href="/login" onClick={() => setMenuOpen(false)}>
              <PrimaryButton variant="login">Sign In</PrimaryButton>
            </Link>
          }
        </motion.li>
      </motion.ul>
    </nav>
  );
};

export default NavLinks;
