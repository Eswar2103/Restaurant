import { getOwnRestaurants } from "../services/apiRestaurants";
import { Link } from "react-router-dom";
import { RatingStars } from "./Utils";
import RestaurantsCard from "../components/RestaurantsCard";
import { SkeletonCard } from "../components/Loader";

function MyRestaurants() {
  return (
    <RestaurantsCard
      path="my-restaurants"
      queryFunction={getOwnRestaurants}
      queryKey="own-restaurants"
    />
  );
}

export default MyRestaurants;
