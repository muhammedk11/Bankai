function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-sm rounded-lg border border-white/10 bg-[#15151f] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
    />
  );
}

export default SearchBar;
