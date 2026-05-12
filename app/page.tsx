import HomePage from "@/components/HomePage";
import { buildHomeMetadata } from "@/lib/metadata";

export const metadata = buildHomeMetadata("en");

export default function Home() {
  return <HomePage locale="en" />;
}
