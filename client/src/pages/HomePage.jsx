import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import FeaturedCollections from "../components/FeaturedCollections";
import PromoBanner from "../components/PromoBanner";
import Benefits from "../components/Benefits";
import BrandStory from "../components/BrandStory";
import Testimonials from "../components/Testimonials";
import InstagramGallery from "../components/InstagramGallery";
import ShopCTA from "../components/ShopCTA";
import Newsletter from "../components/Newsletter";
import EditorialShowcase from "../components/EditorialShowcase";
import ProjectReadinessBanner from "../components/ProjectReadinessBanner";

function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedCollections />
      <FeaturedProducts />
      <BrandStory />
      <EditorialShowcase />
      <PromoBanner />
      <Benefits />
      <Testimonials />
      <InstagramGallery />
      <ProjectReadinessBanner />
      <ShopCTA />
      <Newsletter />
    </>
  );
}

export default HomePage;
