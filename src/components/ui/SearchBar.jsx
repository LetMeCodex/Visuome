import React from "react";

export function SearchBar({ value = "", onChange, placeholder = "Search..." }) {
  return (
    <div className="search-bar relative w-64">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-md py-1.5 pl-8 pr-3 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] placeholder-[var(--color-textMuted)]"
      />
      <div className="absolute left-2.5 top-2 text-[var(--color-textMuted)] opacity-60">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
export default SearchBar;
