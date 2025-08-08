import CallToAction from "../components/CallToAction";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/Hero";
import QnaSection from "../components/QnA";
import UserReviews from "../components/UserReview";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-tr from-[#B6DEE3] to-[#F0F7EB]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CallToAction />
      <UserReviews />
      <QnaSection />
      <Footer />
    </div>
  );
}
