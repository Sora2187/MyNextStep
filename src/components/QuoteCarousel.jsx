import React, { useState, useEffect } from "react";

function QuoteCarousel() {
  const [quotes, setQuotes] = useState([
    "Believe in yourself and all that you are.",
    "The future depends on what we do in the present.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Your time is limited, so don’t waste it living someone else’s life.",
    "The only way to do great work is to love what you do.",
  ]);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const nextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuoteIndex(
      (prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length
    );
  };

  return (
    <div className="quote-carousel">
      <h4>Motivational Quotes</h4>
      <div className="quote-container">
        <p>{quotes[currentQuoteIndex]}</p>
      </div>
      <div className="carousel-controls">
        <button onClick={prevQuote}>Previous </button>
        <button onClick={nextQuote}> Next</button>
      </div>
    </div>
  );
}

export default QuoteCarousel;
