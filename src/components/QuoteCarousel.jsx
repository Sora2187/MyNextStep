import React, { useState, useEffect } from "react";

const QuoteCarousel = () => {
  const quotes = [
    "Success is not the key to happiness. Happiness is the key to success.",
    "The only way to do great work is to love what you do.",
    "It always seems impossible until it's done.",
    "Believe you can and you're halfway there.",
    "Don’t watch the clock; do what it does. Keep going.",
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) =>
        prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [quotes.length]);

  return (
    <div className="quote-carousel bg-gray-200 p-4 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-center">
        {quotes[currentQuoteIndex]}
      </p>
    </div>
  );
};

export default QuoteCarousel;
