import { supabase } from "./supabase";

async function addRestaurant(restaurantData) {
  const { error } = await supabase
    .from("restaurants")
    .insert({
      ...restaurantData,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
}

async function getOwnRestaurants(_c, page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  if (!data?.user) {
    throw new Error("User not authenticated");
  }
  const {
    data: restaurants,
    error: restaurantsError,
    count,
  } = await supabase
    .from("restaurants")
    .select("*,name, reviews(rating)", { count: "exact" })
    .eq("owner_id", data.user.id)
    .range(from, to);
  if (restaurantsError) {
    throw restaurantsError;
  }
  return {
    restaurants: calculateReviews(restaurants),
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
}

async function fetchAllRestaurants(city, page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("restaurants")
    .select("id, image_url,city, name, reviews(rating)", { count: "exact" })
    .range(from, to);

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }
  const { data, error, count } = await query;
  if (error) {
    throw error;
  }

  return {
    restaurants: calculateReviews(data),
    totalCount: count,
    totalPages: Math.ceil(count / pageSize),
  };
}

function calculateReviews(data) {
  return data.map((restaurant) => {
    if (!restaurant.reviews) {
      restaurant.reviews = [];
    } else if (!Array.isArray(restaurant.reviews)) {
      restaurant.reviews = [restaurant.reviews];
    }
    return {
      ...restaurant,
      averageRating:
        restaurant?.reviews?.length > 0
          ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) /
            restaurant.reviews.length
          : 0,
      totalReviews: restaurant?.reviews?.length || 0,
    };
  });
}

async function fetchRestaurantByIdWithReviews(id) {
  const { data, error } = await supabase
    .from("restaurants")
    .select(
      "*,owner:users!owner_id(name), reviews(rating, comment, reviewer_id, created_at, reviewer:users!reviewer_id(name))",
    )
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }

  if (data.reviews) {
    if (!Array.isArray(data.reviews)) {
      data.reviews = [data.reviews];
    }
  } else {
    data.reviews = [];
  }

  return {
    ...data,
    averageRating:
      data?.reviews?.length > 0
        ? data.reviews.reduce((sum, r) => sum + r.rating, 0) /
          data.reviews.length
        : 0,
    totalReviews: data?.reviews?.length || 0,
  };
}

async function addReview(restaurantId, reviewerId, reviewData) {
  const { error } = await supabase.from("reviews").insert({
    restaurant_id: restaurantId,
    reviewer_id: reviewerId,
    ...reviewData,
  });

  if (error) {
    throw error;
  }
}

async function updateReview(restaurantId, reviewerId, reviewData) {
  const { error } = await supabase
    .from("reviews")
    .update(reviewData)
    .eq("restaurant_id", restaurantId)
    .eq("reviewer_id", reviewerId);
  if (error) {
    throw error;
  }
}

async function updateRestaurant(data) {
  console.log("data--:", data);
  const { error } = await supabase
    .from("restaurants")
    .update({
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    .eq("id", data.id)
    .select()
    .single();
  if (error) {
    throw error;
  }
}

async function deleteRestaurant(restaurantId) {
  const { error } = await supabase
    .from("restaurants")
    .delete()
    .eq("id", restaurantId);

  if (error) {
    throw error;
  }
}

async function getCities() {
  const { data, error } = await supabase.rpc("get_distinct_cities");
  if (error) {
    throw error;
  }
  return data.map((r) => r.city);
}

async function deleteReview(restaurantId, reviewerId) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("restaurant_id", restaurantId)
    .eq("reviewer_id", reviewerId);
  if (error) {
    throw error;
  }
}

export {
  addRestaurant,
  getOwnRestaurants,
  fetchAllRestaurants,
  fetchRestaurantByIdWithReviews,
  updateReview,
  addReview,
  updateRestaurant,
  deleteRestaurant,
  getCities,
  deleteReview,
};
