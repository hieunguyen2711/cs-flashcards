import React, { useRef, useEffect, useState } from "react";

const GameCard = ({question, answer, isFlipped, onFlip, level}) => {
    const cardRef = useRef(null);
    const [isTouching, setIsTouching] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleTouchStart = (e) => {
            e.preventDefault();
            setIsTouching(true);
            card.classList.add('touch-active');
            // Trigger flip immediately on touch start
            onFlip();
        };

        const handleTouchEnd = (e) => {
            e.preventDefault();
            setIsTouching(false);
            card.classList.remove('touch-active');
        };

        const handleClick = (e) => {
            e.preventDefault();
            if (!isTouching) { // Only handle click if not from touch
                onFlip();
            }
        };

        // Add touch events
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchend', handleTouchEnd, { passive: false });
        card.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        
        // Add click event for non-touch devices
        card.addEventListener('click', handleClick);

        return () => {
            card.removeEventListener('touchstart', handleTouchStart);
            card.removeEventListener('touchend', handleTouchEnd);
            card.removeEventListener('touchcancel', handleTouchEnd);
            card.removeEventListener('click', handleClick);
        };
    }, [onFlip, isTouching]);

    return (
        <div 
            ref={cardRef}
            className={`card ${isFlipped ? "flipped" : ""}`} 
            id={level}
            style={{ touchAction: 'manipulation' }}
        >
            <div className="front">{question}</div>
            <div className="back">{answer}</div>
        </div>
    );
};

export default GameCard;