import { useQuery } from "@tanstack/react-query";
import { fetchRestaurantByIdWithReviews } from "../services/apiRestaurants";
import { FilePenLine, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FormRow, LoadingButton, RatingStars } from "./Utils";
import AddReviewForm from "../components/AddReviewForm";
import Reviews from "../components/Reviews";
import AddRestaurantForm from "../components/AddRestaurantForm";
import { SkeletonCard } from "../components/LOader";

function RestaurantView() {
  const { id } = useParams();
  const {
    data: restaurant,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => fetchRestaurantByIdWithReviews(id),
  });

  if (isLoading) return <SkeletonCard />;
  if (isError) {
    toast.error("Unable to fetch restaurant details.");
    return;
  }

  return (
    <section>
      <div className="flex gap-3">
        <p className="text-4xl text-black/80 font-bold capitalize">
          {restaurant.name}
        </p>
        <RatingStars rating={restaurant.averageRating} />
      </div>
      <p className="mb-2 font-bold text-black/70">{restaurant.city}</p>
      <div className="flex flex-col min-[850px]:flex-row gap-4 items-center">
        <img
          className="w-[500px] min-[851px]:max-[950px]:w-[370px] object-cover h-auto max-w-full rounded-lg shrink-0"
          src={restaurant.image_url}
          alt={restaurant.name}
        />
        <p className="text-justify font-semibold">{restaurant.description}</p>
      </div>
      <p className="my-6 text-2xl font-bold text-black/80">Reviews</p>
      <Reviews restaurantData={restaurant} />
    </section>
  );
}

export default RestaurantView;
