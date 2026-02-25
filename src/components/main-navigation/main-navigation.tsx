"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import BrandLogo from "./brand-logo";
import HamburgerMenu from "./hamburger-menu";
import NavLinks from "./nav-links";

export const MainNavigation = ({ cartCount }: { cartCount: number }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, isPending } = useSession();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
        initial={prefersReducedMotion ? false : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        role="banner"
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isScrolled ? "py-2.5 bg-white/90 backdrop-blur-md shadow-md" : "py-4 bg-white shadow-sm"
        }`}
      >
        <div className="mx-auto flex w-full max-w-350 items-center px-4 md:px-8 lg:px-16">
          <div className="flex gap-8 md:gap-16 flex-1 items-center">
            <motion.div
              animate={{ scale: isScrolled ? 0.92 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <BrandLogo />
            </motion.div>

            <NavLinks
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              session={session}
              cartCount={cartCount}
            />
          </div>

          <div className="flex lg:hidden items-center gap-3 ms-auto">
            <HamburgerMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        </div>
      </motion.header>
  );
};
