import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import { buildHomeMetadata } from "@/lib/metadata";
import { isLocaleCode, localeCodes, type LocaleCode } from "@/lib/locales";

type LocalePageProps = {
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return localeCodes.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export function generateMetadata({ params }: LocalePageProps) {
  if (!isLocaleCode(params.locale)) return {};
  return buildHomeMetadata(params.locale as LocaleCode);
}

export default function LocalePage({ params }: LocalePageProps) {
  if (!isLocaleCode(params.locale)) notFound();
  return <HomePage locale={params.locale} />;
}
