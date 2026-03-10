export default function App() {
  const radius = 200;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.75;
  const offset = circumference * (1 - progress);
  return (
    <div>
      <h1>Boxing Timer</h1>
      <svg height="700" width="700">
        <circle r={radius} cx="300" cy="300" fill="none" stroke="black" strokeWidth="15" opacity="0.5"/> 
        <circle r={radius} cx="300" cy="300" fill="none" stroke="red" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90, 300, 300)"/> 
      </svg>
    </div>
  )
}