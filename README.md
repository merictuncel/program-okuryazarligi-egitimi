# TÜBİTAK 2237-A Proje Sitesi

Örgün pedagojik formasyon öğrencileri için program okuryazarlığı eğitimi proje önerisi web sitesi.

**Stack:** Next.js 16 · Prisma (SQLite / Turso) · NextAuth · Vercel Blob · Tailwind CSS 4

## Yerel geliştirme

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

## Ücretsiz yayın (GitHub + Vercel + Turso + Blob)

Ayrıntılı adımlar: **[YAYIN-GITHUB.md](./YAYIN-GITHUB.md)**

Kısa özet:
1. Repoyu GitHub’a push edin  
2. Turso veritabanı oluşturun → `npm run db:turso-migrate`  
3. Vercel Blob token alın  
4. Vercel’e GitHub repo bağlayın, env değişkenlerini girin  
5. `NEXTAUTH_URL` canlı adrese ayarlayıp redeploy edin  

## Ortam değişkenleri

| Değişken | Ortam | Açıklama |
|---|---|---|
| `DATABASE_URL` | Yerel / build | `file:./dev.db` |
| `TURSO_DATABASE_URL` | Vercel | `libsql://...` |
| `TURSO_AUTH_TOKEN` | Vercel | Turso token |
| `BLOB_READ_WRITE_TOKEN` | Vercel | Dosya yüklemeleri |
| `NEXTAUTH_URL` | Hepsi | Site kök URL |
| `NEXTAUTH_SECRET` | Hepsi | Uzun gizli anahtar |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed | İlk admin |

## Yönetim paneli

Site ayarları, başvuru, program, eğitmenler, duyurular (pop-up), SSS, belgeler, galeri, şifre değiştirme.

## Yedekleme

- Yerel: `prisma/*.db` + `public/uploads/`  
- Canlı: Turso snapshot / Vercel Blob; içerik admin’den yönetilir  
