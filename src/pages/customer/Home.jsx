import HeroCarousel from "../../components/home/HeroCarousel"
import SiteFooter from "../../components/layout/SiteFooter";

import HomeCategories from "../../components/home/HomeCategories";
import HomeTopDeals from "../../components/home/HomeTopDeals";
import HomeNewArrivals from "../../components/home/HomeNewArrivals";
import HomeTestimonials from "../../components/home/HomeTestimonials";
import HomeFeaturesStrip from "../../components/home/HomeFeaturesStrip";

export default function Home(){
  return(
    <>
    <div className="min-h-screen bg-white">
      <HeroCarousel />

      <HomeCategories />
      <HomeTopDeals />
      <HomeNewArrivals />
      <HomeTestimonials />
      <HomeFeaturesStrip />

      <SiteFooter />
    </div>
    </>
  );
}