import React from "react";

const GameCard = ({question, answer, isFlipped, onFlip, level}) => {
    return (
        <div className={`card ${isFlipped ? "flipped" : ""}`} onClick={onFlip} id={level}>
            <div className="front">{question}</div>
            <div className="back">{answer}</div>
        </div>
    );
};

export default GameCard;