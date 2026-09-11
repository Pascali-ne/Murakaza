import HeroBanner from "@/components/HeroBanner";
import SupplyGrid from "@/components/SupplyGrid";
import CourseGrid from "@/components/CourseGrid";
import FeedbackForm from "@/components/FeedbackForm";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <SupplyGrid />
      <CourseGrid />
      <FeedbackForm />
    </>
  );
}
