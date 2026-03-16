import { useState, useEffect, useRef } from 'react';

export default function App() {

  const setTimerSeconds = 10;

  const [timeLeft, setTimeLeft] = useState(setTimerSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const ref = useRef();

  function start() {
    setIsRunning(true);
  }

  function pause() {
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    // reset the timer
    setTimeLeft(setTimerSeconds);
  }

  useEffect(() => {
    if (isRunning) {
      clearInterval(ref.current)
      ref.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(ref.current);
          return 0;
        }
        return prev - 1});
      }, 1000);

      // Cleanup 
      return () => {
        clearInterval(ref.current);
      }
    }
  }, [isRunning]);

  

  const size = 600;
  const centerViewBox = size / 2;
  const radius = centerViewBox / 3;
  const circumference = 2 * Math.PI * radius;
  const round = 10;
  const progress = timeLeft / round;
  const offset = circumference * (1 - progress);
  const cy = centerViewBox - 100;
  
  return (
    <div>
      <h1>Boxing Timer</h1>
      <button type="button" onClick={start}>Start</button>
      <button type="button" onClick={pause}>Pause</button>
      <button type="reset" onClick={reset}>Reset</button>
      <svg viewBox ={`0 0 ${size} ${size}`} >
        <circle r={radius} cx={centerViewBox} cy={cy} fill="none" stroke="black" strokeWidth="15" opacity="0.5"/> 
        <circle r={radius} cx={centerViewBox} cy={cy} fill="none" stroke="red" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} 
        transform={`rotate(-90, ${centerViewBox}, ${cy})`}/> 
      </svg>
    </div>
  )
}