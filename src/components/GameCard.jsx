import React, { useState } from "react";

const GameCard = ({question, answer, isFlipped, onFlip, level}) => {
    
    

    return (
        <div>
            <div className={`card ${isFlipped ? "flipped": ""}`} onClick={onFlip} id={level}>
                    <div className="front" >{question}</div>
                    <br/>
                    <div className="back" >{answer} </div>                                       
            </div>
        </div>
        
    );
};

export default GameCard;