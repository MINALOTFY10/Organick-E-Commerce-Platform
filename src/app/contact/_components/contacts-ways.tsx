import Image from "next/image";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ContactUsLeftImg from "@/../public/img/ContactUsLeftImg.png";
import MessageIconImg from "@/../public/img/MessageIcon.png";
import PhoneIconImg from "@/../public/img/PhoneIcon.png";

export default function ContactsWays() {
  return (
    <div className="mx-auto max-w-6xl mt-8 sm:mt-16 px-4 flex flex-col xl:flex-row items-center xl:items-start">
      {/* Left Image */}
      <div className="xl:w-1/2 flex justify-center mb-10 xl:mb-0">
        <Image
          src={ContactUsLeftImg}
          alt="Contact Us"
          className="rounded-3xl w-3/5"
        />
      </div>

      {/* Right Text & Cards */}
      <div className="xl:w-1/2 flex flex-col space-y-3">
        <h3 className="text-2xl font-bold text-primary">
          We&apos;d love to talk about how we can work together.
        </h3>
        <p className="text-gray-500">
          At Organick, we provide tailored solutions for sustainable farming and
          organic business growth. Let&apos;s discuss how we can bring your
          organic vision to life.
        </p>

        {/* Contact Cards */}
        <div className="flex flex-col space-y-4">
          {/* Message */}
          <div className="flex items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition">
            <Image src={MessageIconImg} width={65} alt="Message Icon" />
            <div className="ml-4 flex flex-col">
              <h5 className="text-primary font-semibold">Message</h5>
              <p>support@organic.com</p>
            </div>
          </div>
          {/* Phone */}
          <div className="flex items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition">
            <Image src={PhoneIconImg} width={65} alt="Phone Icon" />
            <div className="ml-4 flex flex-col">
              <h5 className="text-primary font-semibold">Contact Us</h5>
              <p>+01 123 456 789</p>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-3 mt-4">
          {[
            { icon: faFacebook, label: "Facebook" },
            { icon: faInstagram, label: "Instagram" },
            { icon: faTwitter, label: "Twitter" },
            { icon: faPinterest, label: "Pinterest" },
          ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="p-3 rounded-full bg-[#EFF6F1] cursor-pointer hover:bg-[#D6EAD3] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondary-color)"
              >
                <FontAwesomeIcon icon={icon} aria-hidden="true" />
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
