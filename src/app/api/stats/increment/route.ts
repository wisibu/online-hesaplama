// src/app/api/stats/increment/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';

export async function POST(request: Request) {
  try {
    // Güncel tarihi YYYY-AA-GG formatında alalım
    const today = new Date().toLocaleDateString('sv'); // 'sv' locale'i YYYY-MM-DD formatını verir
    const dailyKey = `gunluk_hesaplama_${today}`;

    // 1. Toplam hesaplama sayacını 1 artır
    await query({
      query: "UPDATE SiteIstatistikleri SET deger = deger + 1 WHERE anahtar = 'toplam_hesaplama'",
    });

    // 2. Günlük hesaplama sayacını 1 artır.
    await query({
      query: `
        INSERT INTO SiteIstatistikleri (anahtar, deger) 
        VALUES (?, 1) 
        ON DUPLICATE KEY UPDATE deger = deger + 1
      `,
      values: [dailyKey],
    });

    return NextResponse.json({ message: 'Sayaçlar başarıyla güncellendi.' }, { status: 200 });

  } catch (error) { // <--- BU KISMI GÜNCELLEYİN
    let errorMessage = 'Bilinmeyen bir sunucu hatası oluştu.';
    if (error instanceof Error) {
      // error'ın gerçekten bir Error nesnesi olup olmadığını kontrol ediyoruz
      errorMessage = error.message;
    }
    console.error("API Sayaç Güncelleme Hatası:", errorMessage);
    return NextResponse.json({ message: 'Sayaç güncellenirken bir sunucu hatası oluştu.', errorDetails: errorMessage }, { status: 500 });
  }
}