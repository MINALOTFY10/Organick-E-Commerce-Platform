import SectionHeader from "@/components/section-header";
import ServiceSingleImg from "@/../public/img/ServiceSingle.jpg";
import ServiceSingleSection from "@/app/service/_components/service-details-section";

export default function DetailsPage() {
  return (
    <>
      <SectionHeader img={ServiceSingleImg} title={"Quality Standard"} />
      <ServiceSingleSection />
    </>
  );
}
