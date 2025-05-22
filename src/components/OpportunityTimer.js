import React, { useState, useEffect } from 'react';
import { calculateTimeRemaining } from '../utils/timeUtils';

const OpportunityTimer = ({ deliveryDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(deliveryDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(deliveryDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [deliveryDate]);

  return (
    <div className="bg-gray-100 p-3 rounded-lg">
      <div className="flex justify-between text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div>Días</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div>Horas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div>Minutos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div>Segundos</div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityTimer;