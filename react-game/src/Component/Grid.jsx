import React, { useState, useEffect } from "react";
import "./Grid.css";

const images = [
  "/art.jpg",
  "/crying.jpg",
  "/pencil.webp",
  "/action.jpg",
  "/fiction.jpg",
  "/herry.jpg",
];

export default function Grid() {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [numberOfMoves, setMoves] = useState(0);

  // Shuffle and initialize cards
  useEffect(() => {
    const shuffledCards = [...images, ...images]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({ id: index, image, isFlipped: false }));
    setCards(shuffledCards);
  }, []);

  // Handle card click
  const clickHandler = (id) => {
    // Prevent double-clicking on the same card or already flipped cards
    if (selectedCards.includes(id) || cards[id].isFlipped) return;

    // Increment moves
    setMoves((prevMoves) => prevMoves + 1);

    // Flip the clicked card immediately
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === id ? { ...card, isFlipped: true } : card
      )
    );

    // Add the clicked card to selectedCards
    const newSelectedCards = [...selectedCards, id];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      const [firstCard, secondCard] = newSelectedCards.map(
        (index) => cards[index]
      );

      if (firstCard.image === secondCard.image) {
        // If the two cards match, mark them as matched
        setMatchedCards((prevMatchedCards) => [
          ...prevMatchedCards,
          firstCard.image,
        ]);
        setSelectedCards([]); // Clear selected cards after a match
      } else {
        // If they don't match, flip them back after a delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              newSelectedCards.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setSelectedCards([]); // Clear selected cards after flipping back
        }, 1000);
      }
    }
  };

  return (
    <div>
      {/* Display the number of moves */}
      <div className="moves-info">
        <p>Number of Moves: {numberOfMoves}</p>
      </div>

      {/* Display the cards */}
      <div className="flex">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? "flipped" : ""}`}
            onClick={() => clickHandler(card.id)}
          >
            {/* Show image if flipped or matched, otherwise show card back */}
            {card.isFlipped || matchedCards.includes(card.image) ? (
              <img src={card.image} alt="Memory card" />
            ) : (
              <div className="card-back"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
