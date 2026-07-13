import { useState, useEffect, useRef, useReducer } from 'react';



export default function App() {

  const fightDuration = 10;
  const totalRounds = 3;
  const restDuration = 5;

  const initState = {
    phase: "idle",
    round: 1,
    timeLeft: fightDuration
  };

  function reducer(state, action) {
    switch(action.type) {
      case "START":
        return {
          ...state,
          phase: "fight",
          round: 1,
          timeLeft: fightDuration
        };

      case "PAUSE":
        return state;
        
      case "RESET":
        return {
          ...state,
          phase: "idle",
          round: 1,
          timeLeft: fightDuration
        };
        
      case "TICK":
        // Normal ticking
        if(state.timeLeft > 1) {
          return {...state, timeLeft: state.timeLeft - 1};
        }

        // Fight to done
        if (state.phase == "fight" && state.round == totalRounds) {
          return {...state, phase: "done", round: totalRounds, timeLeft: 0};
        }

        // Fight to rest
        if (state.phase == "fight") {
          return {...state, phase: "rest", timeLeft: restDuration};
        }

        // Rest to fight
        if (state.phase == "rest") {
          return {...state, phase: "fight", round: state.round + 1, timeLeft: fightDuration}
        }

        return state;

      default:
        return state;  
    }
  }

  const [state, dispatch] = useReducer(reducer, initState);
  const [isRunning, setIsRunning] = useState(false);
  const ref = useRef();
  const bellRef = useRef(null);

  function playBell() {

    // To make sure the bell plays after every reset
    if (bellRef.current.state === 'suspended') {
      bellRef.current.resume();
    }

    const gainNode = bellRef.current.createGain();
    const osci = bellRef.current.createOscillator();

    // Specify the frequency etc for the bell sounds
    osci.type = "triangle";
    osci.frequency.setValueAtTime(880, bellRef.current.currentTime);
    osci.connect(gainNode);
    gainNode.connect(bellRef.current.destination);
    gainNode.gain.setValueAtTime(1, bellRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, bellRef.current.currentTime + 0.5);
    osci.start();
    osci.stop(bellRef.current.currentTime + 0.5);
  }

  function start() {
    setIsRunning(true);
    dispatch({type: "START"});
    if (!bellRef.current) {
      bellRef.current = new AudioContext();
    }
    playBell();
  }

  function pause() {
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    // Dispatch sets all the states in one
    dispatch({type: "RESET"});
  }

  useEffect(() => {
    if (isRunning) {
      clearInterval(ref.current)
      ref.current = setInterval(() => {
        dispatch({type: "TICK"});
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
  const totalDuration = state.phase === "rest" ? restDuration : fightDuration;
  const progress = state.timeLeft / totalDuration;
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
        <text x={centerViewBox} y={cy} textAnchor="middle">{state.timeLeft}</text>
        <text x ={centerViewBox} y={cy + 30} textAnchor='middle'>Round {state.round}/{totalRounds}</text>
        <text x ={centerViewBox} y={cy + 50} textAnchor='middle'>{state.phase}</text>
      </svg>
    </div>
  )
}