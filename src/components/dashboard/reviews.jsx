"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const Avatar = ({ name, src, alt }) => {
  const getInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0)).join("");
    return initials.toUpperCase();
  };

  return (
    <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-600 text-white overflow-hidden">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-bold">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default function ReviewsList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="text-gray-800 body-font ">
      <div className="container px-5 py-10 mx-auto">
        <h1 className="text-4xl font-semibold text-center  mb-12 text-gray-500 dark:text-gray-300">
          Reviews
        </h1>

        {reviews.length === 0 ? (
          <p className="text-center w-full text-gray-800 dark:text-white text-lg">No reviews yet.</p>
        ) : (
          <div className="flex flex-wrap -m-4">
            {reviews.map((review, index) => (
              <div key={index} className="p-4 md:w-1/2 w-full ">
                <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full border-2 border-gray-300 dark:border-teal-300">
                  <p className="leading-relaxed mb-4 text-gray-800 dark:text-white text-base italic">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center mb-4 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          review.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-400 dark:text-white"
                        }`}
                        fill={review.rating >= star ? "#facc15" : "none"}
                      />
                    ))}
                  </div>
                  <div className="flex items-center mt-auto">
                    <Avatar
                      src={review.user.image}
                      alt={review.user.name}
                      name={review.user.name}
                    />
                    <div className="flex flex-col pl-4">
                      <span className="font-medium text-gray-800 dark:text-white">
                        {review.user.name}
                      </span>
                      <span className="text-sm text-gray-800 dark:text-white">
                        {review.user.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
