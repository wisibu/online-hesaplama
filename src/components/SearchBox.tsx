"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface Calculator {
  name: string;
  category: string;
  href: string;
}

interface SearchBoxProps {
  allCalculators: Calculator[];
}

export default function SearchBox({ allCalculators }: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCalculators = useMemo(() => {
    if (!searchTerm) return [];
    return allCalculators.filter((calculator: Calculator) =>
      calculator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allCalculators]);

  return (
    <div className="mt-8 max-w-xl mx-auto relative">
      <input
        type="text"
        placeholder="Hesaplama aracı arayın (örn: KDV, Maaş, Kredi...)"
        className="w-full px-5 py-4 text-lg text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300 shadow-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredCalculators.length > 0 && searchTerm && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {filteredCalculators.map((calculator: Calculator, index: number) => (
            <li key={index} className="border-b border-gray-100 last:border-b-0">
              <Link href={calculator.href} className="block px-6 py-3 hover:bg-blue-50 transition duration-150">
                <p className="font-semibold text-gray-800">{calculator.name}</p>
                <p className="text-sm text-gray-500">{calculator.category}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 