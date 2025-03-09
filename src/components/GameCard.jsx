import React, { useState } from "react";

const GameCard = (props) => {
    
    const [isFlipped, setisFlipped] = useState(false);
    const handleCardClick = () => {
        setisFlipped(!isFlipped);
    }

    return (
        <div>
            <div className={`card ${isFlipped ? "flipped": ""}`} onClick={handleCardClick} id={props.level}>
                    <div className="front" >{props.question}</div>
                    <br/>
                    <div className="back" >{props.answer} </div>                                       
            </div>
        </div>
        
    );
};

export default GameCard;