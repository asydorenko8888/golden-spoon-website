import ContactClosing from "@/components/contact/ContactClosing";
import ContactHero from "@/components/contact/ContactHero";
import ContactStrip from "@/components/contact/ContactStrip";
import InquirySection from "@/components/contact/InquirySection";
import ServiceArea from "@/components/contact/ServiceArea";
import { getPublicContactContent } from "@/lib/contact/getPublicContactContent";
import { site } from "@/data/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Contact | ${site.shortName} Boutique Catering`,
  description:
    "Tell us a little about your occasion and we’ll help you create a catering experience tailored to you.",
};

export default async function ContactPage() {
  const content = await getPublicContactContent();

  return (
    <>
      <ContactHero content={content.hero} />
      <ContactStrip items={content.strip} />
      <InquirySection content={content.inquiry} />
      <ServiceArea content={content.serviceArea} />
      <ContactClosing content={content.closing} />
    </>
  );
}
