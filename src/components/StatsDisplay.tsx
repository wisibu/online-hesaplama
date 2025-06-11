// src/components/StatsDisplay.tsx
'use client';

import { useState, useEffect } from 'react';

const StatsDisplay = () => {
  // const [totalCalculations, setTotalCalculations] = useState<number | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const response = await fetch('/api/stats/get');
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       setTotalCalculations(data.total_hesaplama);
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         setError(error.message);
  //       } else {
  //         setError('An unknown error occurred');
  //       }
  //       console.error("İstatistikler alınırken hata oluştu:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStats();
  // }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg text-center">
      {/* {loading && <p>İstatistikler yükleniyor...</p>}
      {error && <p className="text-red-500">Hata: İstatistikler yüklenemedi.</p>}
      {totalCalculations !== null && (
        <div>
          <h2 className="text-2xl font-bold">Toplam Hesaplama</h2>
          <p className="text-4xl font-extrabold text-green-400">{totalCalculations.toLocaleString()}</p>
        </div>
      )} */}
    </div>
  );
};

export default StatsDisplay;
