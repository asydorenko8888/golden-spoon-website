import ValuesStrip from "@/components/about/ValuesStrip";
import ServicesCta from "@/components/services/ServicesCta";
import ServicesGrid from "@/components/services/ServicesGrid";
import ServicesHero from "@/components/services/ServicesHero";
import { getPublicServicesContent } from "@/lib/services/getPublicServicesContent";
import { site } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Services | ${site.shortName} Boutique Catering`,
  description:
    "From intimate gatherings to large celebrations, Golden Spoon creates customized catering experiences with exceptional cuisine and attentive service.",
};

export default async function ServicesPage() {
  const content = await getPublicServicesContent();

  return (
    <>
      <ServicesHero content={content.hero} />
      <ValuesStrip items={content.strip} />
      <ServicesGrid items={content.items} />
      <ServicesCta content={content.cta} />
    </>
  );
}
