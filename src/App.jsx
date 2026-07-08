import { useState, useEffect, useRef } from 'react';

export default function App() {

  const fightDuration = 10;
  const totalRounds = 10;
  const restDuration = 5;

  const [timerPhase, setTimerPhase] = useState("idle");
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(fightDuration);
  const [isRunning, setIsRunning] = useState(false);
  const ref = useRef();
  const phaseRef = useRef("idle");
  const roundRef = useRef(1);

  function start() {
    setIsRunning(true);
    setTimerPhase("fight");
    phaseRef.current = "fight";
  }

  function pause() {
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    // reset the timer
    setTimeLeft(fightDuration);

    // reset the round to 1
    setCurrentRound(1);
    roundRef.current = 1;

    // reset the phase to idle
    setTimerPhase("idle");
    phaseRef.current = "idle";
  }

  useEffect(() => {
    if (isRunning) {
      clearInterval(ref.current)
      ref.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          console.log("transitioning from:", phaseRef.current, "time:", Date.now());
          // When the last round's fight timer has ended
          if (roundRef.current === totalRounds && phaseRef.current == "fight") {
            clearInterval(ref.current);
            // Move to the done phase - reset timer completely
            setTimerPhase("done");
            phaseRef.current = "done";
            reset();
          }
          // If it's still not the last round
          else if (phaseRef.current === "fight") {
            // Move to the rest phase
            setTimerPhase("rest");
            phaseRef.current = "rest";
            setCurrentRound(prev => prev + 1);
            roundRef.current = roundRef.current + 1;
            // Set the timer to rest duration
            return restDuration;
          }
          // If the timer is in the rest phase
          else if (phaseRef.current === "rest") {
            // Set it to fight phase
            setTimerPhase("fight");
            phaseRef.current = "fight";
            return fightDuration;
          }
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
  const totalDuration = timerPhase === "rest" ? restDuration : fightDuration;
  const progress = timeLeft / totalDuration;
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
        <text x={centerViewBox} y={cy} textAnchor="middle">{timeLeft}</text>
      </svg>
    </div>
  )
}