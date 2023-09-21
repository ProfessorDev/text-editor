import katex from "katex";
import { useState } from "react";
import { symbols } from "../utils/katexSymbols";
import { InformationCircleIcon } from "@heroicons/react/outline";

type SymbolsListProps = {
  onSymbolClick: (symbol: string) => void;
};

const SymbolsList: React.FC<SymbolsListProps> = ({ onSymbolClick }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const iconSet = new Set();
  const filteredSymbols = symbols
    .filter((symbol) => symbol.category === category || category === "all")
    .filter(
      (symbol) =>
        symbol.icon.toLowerCase().includes(search.toLowerCase()) ||
        symbol.category.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((symbol) => {
      const there = iconSet.has(symbol.icon);
      if (!there) {
        iconSet.add(symbol.icon);
      }
      return !there;
    });

  return (
    <div className="bg-white w-96 h-60 p-2 shadow border border-gray-200 rounded-md overflow-auto">
      <div className="flex justify-end mb-2">
        <a
          href="https://katex.org/docs/supported"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 text-xs hover:underline"
        >
          <InformationCircleIcon className="h-4 inline" /> Learn how to use math
          symbols
        </a>
      </div>
      <div className="flex flex-col gap-2 sticky top-0 bg-white z-50">
        <input
          className="flex-1 border border-gray-200 px-2 py-1"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <select
          className="flex-1 px-2 py-1"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="all">All</option>
          <option value="greek and hebrew letters">Greek/Hebrew Letters</option>
          <option value="delimiters">Delimiters</option>
          <option value="maths constructs">Maths Constructs</option>
          <option value="variable sized symbols">Variable-sized Symbols</option>
          <option value="standard functions">Standard Functions</option>
          <option value="operators and relations">
            Operators and Relations
          </option>
          <option value="arrows">Arrows</option>
          <option value="accents">Accents</option>
          <option value="miscellaneous">Miscellaneous</option>
          <option value="letter styles">Letter Styles</option>
        </select>
      </div>
      <div className="flex gap-2 flex-wrap mt-2">
        {filteredSymbols.map((symbol) => {
          return (
            <div key={symbol.icon}>
              <button
                type="button"
                title={symbol.icon}
                className="hover:text-blue-600"
                dangerouslySetInnerHTML={{
                  __html: symbol.html,
                }}
                onClick={() => {
                  onSymbolClick(symbol.render);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

type SymbolsProps = {
  onSymbolClick: (symbol: string) => void;
};
export const Symbols: React.FC<SymbolsProps> = ({ onSymbolClick }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        title="Latex Math Symbols"
        className="hover:text-blue-600"
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(`\\sqrt{x}`),
        }}
        onClick={() => {
          setOpen(!open);
        }}
      />
      {open && (
        <div className="absolute top-full right-0">
          <SymbolsList onSymbolClick={onSymbolClick} />
        </div>
      )}
    </div>
  );
};
