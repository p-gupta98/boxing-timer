import { useState, useEffect, useRef, useReducer } from 'react';
import './App.css';

export default function App() {

  const [fightDuration, setFightDuration] = useState(10);
  const [totalRounds, setTotalRounds] = useState(3);
  const [restDuration, setRestDuration] = useState(5);
  // Settings panel visibility
  const [showSettings, setShowSettings] = useState(false);

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

      case "SYNC_SETTINGS":
      if (state.phase === "idle" || state.phase === "fight") {
        return { ...state, timeLeft: action.fightDuration };
      }
      if (state.phase === "rest") {
        return { ...state, timeLeft: action.restDuration };
      }
      return state; 
        
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
    if (state.phase == "idle") {
      dispatch({type: "START"});
    }
    
    if (!bellRef.current) {
      bellRef.current = new AudioContext();
    }
  }

  function pause() {
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    // Dispatch sets all the states in one
    dispatch({type: "RESET"});
  }

  function handleFightDurationChange(value) {
    setFightDuration(value);
    dispatch({ type: "SYNC_SETTINGS", fightDuration: value, restDuration });
  }

  function handleRestDurationChange(value) {
    setRestDuration(value);
    dispatch({ type: "SYNC_SETTINGS", fightDuration, restDuration: value });
  }

  // Rounds does not need a dispatch - the value is not copied to the state variable
  function handleTotalRoundsChange(value) {
    setTotalRounds(value);
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

  useEffect(() => {
  if (state.phase === "fight") {
    playBell();
  } else if (state.phase === "rest") {
    playBell();
    setTimeout(() => playBell(), 300);
  } else if (state.phase === "done") {
    playBell();
    setTimeout(() => playBell(), 300);
    setTimeout(() => playBell(), 600);
    setIsRunning(false);
    setTimeout(() => dispatch({ type: "RESET" }), 1000);
  }
}, [state.phase]);

  

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
      <button type="button" onClick={() => setShowSettings(prev => !prev)}>☰</button>

      {showSettings && (
        <div className="settings-panel">
          <label>
            Fight duration (sec):
            <input
              type="number"
              value={fightDuration}
              disabled={isRunning}
              onChange={(e) => handleFightDurationChange(Number(e.target.value))}
            />
          </label>

          <label>
            Rest duration (sec):
            <input
              type="number"
              value={restDuration}
              disabled={isRunning}
              onChange={(e) => handleRestDurationChange(Number(e.target.value))}
            />
          </label>

          <label>
            Rounds:
            <input
              type="number"
              value={totalRounds}
              disabled={isRunning}
              onChange={(e) => handleTotalRoundsChange(Number(e.target.value))}
            />
          </label>
        </div>
      )}
      <h1>Boxing Timer</h1>
      <button type="button" onClick={start}>Start</button>
      <button type="button" onClick={pause}>Pause</button>
      <button type="reset" onClick={reset}>Reset</button>
      <svg viewBox ={`0 0 ${size} ${size}`} >
        <g transform={`translate(${centerViewBox}, ${cy})`}>
          <g className={`glove glove-${state.phase} ${!isRunning && state.phase === "fight" ? 'paused': ''}`}>
            <ellipse cx="0" cy="0" rx="35" ry="45" />
            <rect x="-12" y="35" width="24" height="20" rx="6" />
          </g>
        </g>
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