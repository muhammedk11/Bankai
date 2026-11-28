
import { useEffect, useState } from "react";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input, onChange]);

  return (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-sm rounded-lg border border-white/10 bg-[#15151f] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
    />
  );
}

export default SearchBar;
