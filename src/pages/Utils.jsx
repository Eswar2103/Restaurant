function FormRow({ label, error, children }) {
  return (
    <div className={`flex flex-col gap-1 w-full`}>
      {label && (
        <label className="block text-md md:text-lg font-bold">{label}</label>
      )}
      <div className={`flex-1 ${!label ? "flex justify-center" : ""}`}>
        {children}
      </div>
      {error && (
        <p className="text-red-500 text-xs md:text-sm text-center">{error}</p>
      )}
    </div>
  );
}

function Loading({ text }) {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-black border-solid mr-4"></div>
      <span className="text-sm text-black font-semibold">
        {text || "Submitting..."}
      </span>
    </div>
  );
}

function LoadingButton({ text1, text2, isLoading, classes }) {
  return (
    <button
      className={`cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${classes}`}
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? <Loading text={text1} /> : text2}
    </button>
  );
}

function RatingStars({ rating }) {
  const star_filled = (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
    >
      <polygon
        fill="#f1c40f"
        stroke="#f1c40f"
        strokeWidth="2"
        strokeMiterlimit="10"
        points="32,47 12,62 20,38 2,24 24,24 32,1 40,24 
	62,24 44,38 52,62 "
      />
    </svg>
  );
  const star_empty = (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
    >
      <polygon
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeMiterlimit="10"
        points="32,47 12,62 20,38 2,24 24,24 32,1 40,24 
	62,24 44,38 52,62 "
      />
    </svg>
  );
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className="w-5 h-5">
          {n <= rating ? star_filled : star_empty}
        </span>
      ))}
    </div>
  );
}

export { FormRow, LoadingButton, RatingStars };
