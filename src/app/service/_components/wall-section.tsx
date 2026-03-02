import Image from "next/image";
import ServiceWallImg from "@/../public/img/ServiceWall.png";
import OrganicOnlyImg from "@/../public/img/Organic Only.png";

export default function WallSection() {
  return (
    <section
      className="mt-15 h-[85vh] w-full bg-cover bg-center flex flex-col items-center justify-start pt-[12vh] text-center"
      style={{ backgroundImage: `url(${ServiceWallImg.src})` }}
    >
      <div className="bg-opacity-90 rounded-2xl px-6 md:p-0 flex flex-col items-center max-w-3xl mx-4">
        <Image src={OrganicOnlyImg} alt="Organic Only" className="w-30 mb-2" />
        <h2 className="text-3xl md:text-[40px] font-bold text-(--primary-color)">Everyday Fresh & Clean</h2>
        <p className="max-w-xl mt-2 text-[#274c5b] text-sm md:text-base">
          Simply dummy text of the printing and typesetting industry. Lorem has been the industry’s standard dummy text ever since the 1500s.
        </p>
      </div>
    </section>
  );
}
