import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormRow, LoadingButton, RatingStars } from "../pages/Utils";
import { useState } from "react";
import { toast } from "react-toastify";
import AddReviewForm from "../components/AddReviewForm";
import { FilePenLine, Trash2 } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { computeDate } from "../services/utils";
import { deleteReview } from "../services/apiRestaurants";
import { Link, useParams } from "react-router-dom";
import GetConfirmation from "./GetConfirmation";

export default function Reviews({ restaurantData }) {
  const { user, role } = useAuth();
  const { reviews } = restaurantData;
  const userHasReviewed = reviews.some((r) => r.reviewer_id === user?.id);

  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-black/60 font-semibold">
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>{" "}
          to add a review.
        </p>
        {reviews.length > 0 ? <ReviewCards reviews={reviews} /> : null}
      </div>
    );
  }

  // No reviews yet, show add review form
  if (role == "owner") {
    return reviews.length > 0 ? (
      <ReviewCards reviews={reviews} />
    ) : (
      <p className="text-center font-bold text-2xl">No Reviews</p>
    );
  }
  if (reviews.length === 0) {
    return <AddReviewForm />;
  }
  if (userHasReviewed) {
    // User has already reviewed, show their review with option to edit
    const userReview = reviews.find((r) => r.reviewer_id === user?.id);
    return (
      <div className="flex flex-col gap-8">
        <ReviewCardEdit review={userReview} />
        <ReviewCards
          reviews={reviews.filter((r) => r.reviewer_id != user?.id)}
        />
      </div>
    );
  } else {
    // User has not reviewed yet, but there are existing reviews, show add review form and existing reviews
    return (
      <div className="flex flex-col gap-8">
        <AddReviewForm />
        <ReviewCards reviews={reviews} />
      </div>
    );
  }
}

function ReviewCardEdit({ review }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteReview(id, user?.id),
    onSuccess: () => {
      toast.success("Deleted review");
      queryClient.invalidateQueries({ queryKey: ["own-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
      queryClient.invalidateQueries({ queryKey: ["all-restaurants"] });
      setIsEditing(false);
      setIsDelete(false);
    },
    onError: (error) => {
      toast.error("Failed to delete review.");
      console.error("Delete review error:", error);
    },
  });

  function submitDeleteReview() {
    // mutate();
    setIsDelete(true);
  }

  return isEditing ? (
    <AddReviewForm review={review} update={true} setIsEditing={setIsEditing} />
  ) : (
    <div className="flex flex-col gap-4">
      <ReviewCard review={review}>
        <div className="flex justify-end gap-3">
          <button
            className="flex gap-1 border border-none bg-green-600 px-5 py-1 rounded-xl text-white font-bold hover:bg-green-700 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50"
            onClick={() => setIsEditing(true)}
            disabled={isDelete}
          >
            <FilePenLine className="w-4" />
            Edit
          </button>
          <button
            className="flex gap-1 border border-none bg-red-600 px-5 py-1 rounded-xl text-white font-bold hover:bg-red-700 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50"
            onClick={submitDeleteReview}
            disabled={isDeletePending || isDelete}
          >
            <Trash2 className="w-4" />
            Delete Review
          </button>
        </div>
        {isDelete && (
          <GetConfirmation
            mutate={mutate}
            setIsDelete={setIsDelete}
            text="review"
          />
        )}
      </ReviewCard>
    </div>
  );
}

function ReviewCards({ reviews }) {
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => (
        <ReviewCard key={r.reviewer_id} review={r} />
      ))}
    </div>
  );
}

function ReviewCard({ review, children }) {
  return (
    <div className="flex flex-col border border-none rounded-md px-6 py-3 shadow-sm">
      <div className="flex justify-between w-full">
        <RatingStars rating={review.rating} />
        <p className="text-black/80 text-sm">
          By{" "}
          <span className="font-bold capitalize">{review?.reviewer?.name}</span>{" "}
          on {computeDate(review.created_at)}
        </p>
      </div>
      <div className="h-12">
        <p>{review.comment}</p>
      </div>
      {children}
    </div>
  );
}
