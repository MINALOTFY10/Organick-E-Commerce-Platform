const Star = ({ type }: { type: "full" | "half" | "empty" }) => {
  if (type === "half") {
    return (
      <svg className="h-3.5 w-3 text-yellow-400" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#E5E7EB" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half)"
          d="M10 15l-5.878 3.09 1.123-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.757 4.635 1.123 6.545z"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`h-3.5 w-3 ${type === "full" ? "text-yellow-400" : "text-gray-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 15l-5.878 3.09 1.123-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.757 4.635 1.123 6.545z" />
    </svg>
  );
};

export default Star;
