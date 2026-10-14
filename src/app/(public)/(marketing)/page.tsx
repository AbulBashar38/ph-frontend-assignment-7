import type { Metadata } from "next";
import { getFeaturedProperties } from "@/api/public.server";
import BrowseByType from "@/components/modules/home/browse-by-type";
import DemoCta from "@/components/modules/home/demo-cta";
import FaqPreview from "@/components/modules/home/faq-preview";
import FeaturedListings from "@/components/modules/home/featured-listings";
import HeroSection from "@/components/modules/home/hero-section";
import JourneySection from "@/components/modules/home/journey-section";
import NeighborhoodBand from "@/components/modules/home/neighborhood-band";
import RoommateSection from "@/components/modules/home/roommate-section";

export const metadata: Metadata = {
  title: {
    absolute: "BariBasa — Find a Home and Compatible Roommates in Bangladesh",
  },
  description:
    "Search flats, sublets, hostels and rooms with real rent and move-in dates. Match with roommates by budget, area and lifestyle, book viewings, apply and pay rent online.",
  openGraph: {
    title: "BariBasa — Housing & Roommate Platform",
    description:
      "Find a room that fits and people who fit with you. Search listings, match with roommates and pay rent online.",
    type: "website",
    url: "/",
  },
};

export default async function HomePage() {
  const { properties, total } = await getFeaturedProperties(6);

  return (
    <>
      <HeroSection properties={properties} />
      <BrowseByType />
      <FeaturedListings properties={properties} total={total} />
      <NeighborhoodBand />
      <RoommateSection />
      <JourneySection />
      <FaqPreview />
      <DemoCta />
    </>
  );
}
