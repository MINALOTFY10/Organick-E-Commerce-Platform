import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/img/Logo.svg";

export default function BrandLogo() {
  return (
    <Link href="/" className="flex items-center shrink-0">
      <Image src={logo} alt="Organick Logo" width={125} height={40} className="h-auto" priority />
    </Link>
  );
}
