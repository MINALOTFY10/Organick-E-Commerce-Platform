import type { Metadata } from "next";
import SectionHeader from "@/components/section-header";
import ContactUsImg from "@/../public/img/ContactUs.jpg";
import ContactsWays from "@/app/contact/_components/contacts-ways";
import FeedbackFrom from "@/app/contact/_components/feedback-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Organick team. We'd love to hear from you — ask a question, send feedback, or find out where to buy.",
  openGraph: {
    title: "Contact Us — Organick",
    description: "Get in touch with the Organick team. We'd love to hear from you.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <SectionHeader img={ContactUsImg} title={"Contact Us"} />
      <ContactsWays />
      <FeedbackFrom />
    </>
  );
}
