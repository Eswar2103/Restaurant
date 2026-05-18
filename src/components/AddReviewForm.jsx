import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { updateReview, addReview } from "../services/apiRestaurants";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { FormRow, LoadingButton, RatingStars } from "../pages/Utils";

export default function AddReviewForm({
  review,
  update = false,
  setIsEditing,
}) {
  const { id: restaurantId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: AddReview, isPending: isAddReviewPending } = useMutation({
    mutationFn: (data) => addReview(restaurantId, user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["restaurant", restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-review", user.id],
      });
    },
    onError: (error) => {
      toast.error("Failed to submit review. Please try again.");
      console.error("Submit review error:", error);
    },
  });
  const { mutate: UpdateReview, isPending: isUpdateReviewPending } =
    useMutation({
      mutationFn: (data) => updateReview(restaurantId, user.id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["restaurant", restaurantId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user-review", user.id],
        });
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error("Failed to submit review. Please try again.");
        console.error("Submit review error:", error);
      },
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      rating: review?.rating,
      comment: review?.comment,
    },
  });

  let text = "Add Review";
  let loadingText = "Adding Review...";

  if (update) {
    text = "Update Review";
    loadingText = "Updating Review...";
  }

  function onSubmitReview(data) {
    if (update) {
      UpdateReview(data);
    } else {
      AddReview(data);
    }
    reset();
  }
  return (
    <div className="border border-none rounded-xl shadow-lg p-4 mt-4">
      <form onSubmit={handleSubmit(onSubmitReview)}>
        <FormRow
          label="Have you been here? How did you find it?"
          error={errors?.comment?.message}
        >
          <textarea
            className="shadow-sm/10 w-full h-40 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Write your review..."
            {...register("comment", { required: "Comment is required" })}
          />
        </FormRow>
        <div className="flex gap-2 justify-start my-3">
          <label className="font-bold">Rating</label>
          <select
            className="border border-stone-300 rounded-lg w-16"
            {...register("rating", {
              required: "Rating is required",
            })}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>
        <div className="flex justify-center px-8 gap-6">
          <LoadingButton
            type="submit"
            classes="max-w-[800px] w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            text1={loadingText}
            text2={text}
            isLoading={isAddReviewPending || isUpdateReviewPending}
          />
          {update && (
            <button
              className="border border-none bg-red-600 rounded-xl text-white px-3 py-1 font-bold hover:bg-red-700"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
