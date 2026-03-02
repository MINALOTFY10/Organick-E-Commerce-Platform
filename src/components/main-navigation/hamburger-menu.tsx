// src/Components/MainNavigation/hamburger-menu.tsx
interface HamburgerMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const HamburgerMenu = ({ menuOpen, setMenuOpen }: HamburgerMenuProps) => {
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <button
      className="lg:hidden flex flex-col justify-between w-6.5 h-4.5 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--secondary-color)"
      onClick={toggleMenu}
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      aria-controls="main-navigation"
    >
      <span
        className={`block h-0.5 bg-(--primary-color) transition-all duration-300 ${
          menuOpen ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`block h-0.5 bg-(--primary-color) transition-all duration-300 ${
          menuOpen ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 bg-(--primary-color) transition-all duration-300 ${
          menuOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>
  );
};

export default HamburgerMenu;