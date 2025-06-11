// lib/db.ts
import mysql from 'mysql2/promise';

// Veritabanı bağlantı ayarlarını .env.local dosyasından alıyoruz
const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Port numarasını sayıya çeviriyoruz
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // İsteğe bağlı olarak diğer bağlantı ayarlarını buraya ekleyebilirsiniz
  // Örneğin, SSL ayarları veya bağlantı zaman aşımı gibi:
  // connectTimeout: 10000, // 10 saniye
};

// Genel bir sorgu çalıştırma fonksiyonu
export async function query({ query, values = [] }: { query: string; values?: any[] }) {
  let connection;
  try {
    // Her sorgu için yeni bir bağlantı oluşturuyoruz.
    // Yüksek trafikli uygulamalar için connection pooling (bağlantı havuzu) kullanmak daha iyi bir yaklaşımdır.
    // Ancak projemizin bu aşamasında bu yeterli olacaktır.
    connection = await mysql.createConnection(dbConfig);
    
    // Sorguyu çalıştır
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    // Hata yönetimi
    let errorMessage = 'Bilinmeyen bir veritabanı hatası oluştu.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Hata detaylarını sunucu konsoluna yazdırıyoruz (geliştirme için faydalı)
    console.error("VERİTABANI SORGULAMA HATASI ===>");
    console.error("Hata Mesajı:", errorMessage);
    console.error("Çalıştırılan Sorgu:", query);
    console.error("Kullanılan Değerler:", values);
    console.error("Hata Objesi:", error); // Tüm hata objesini görmek için
    console.error("<=== VERİTABANI SORGULAMA HATASI SONU");
    
    // Uygulamanın çökmemesi için hatayı yakalayıp,
    // API katmanında işlenebilecek daha genel bir hata fırlatıyoruz.
    throw new Error(`Veritabanı sorgusu başarısız oldu. Detay: ${errorMessage}`);
  } finally {
    // Bağlantının her zaman kapatıldığından emin oluyoruz
    if (connection) {
      await connection.end();
    }
  }
}