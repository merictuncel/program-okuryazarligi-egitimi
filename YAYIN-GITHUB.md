# GitHub + Vercel üzerinden ücretsiz yayın kılavuzu

Bu proje **GitHub Pages** ile yayınlanamaz (Node.js + admin + veritabanı + dosya yükleme gerekir).  
Ücretsiz ve GitHub bağlantılı doğru yol:

| Katman | Servis | Ücret |
|---|---|---|
| Kod | GitHub | Ücretsiz |
| Site + Admin (Next.js) | Vercel | Ücretsiz |
| Veritabanı | Turso (SQLite uyumlu) | Ücretsiz |
| Görsel/PDF depolama | Vercel Blob | Ücretsiz kota |

Yerelde her şey aynı kalır (`file:./dev.db` + `public/uploads`).

---

## A) Hazırlık (bilgisayarınızda)

1. [GitHub](https://github.com) hesabı açın / giriş yapın.  
2. [Vercel](https://vercel.com) hesabı açın → **Continue with GitHub**.  
3. [Turso](https://turso.tech) hesabı açın → **Sign up with GitHub**.  
4. Bilgisayarda Git kurulu olsun: https://git-scm.com  

Gizli anahtar üretin (PowerShell):

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Bu değeri `NEXTAUTH_SECRET` olarak not edin.

---

## B) GitHub’a kodu yükleme

Proje klasöründe (PowerShell):

```powershell
cd "C:\Users\Alperen\Desktop\meric hoca\tubitak-2237"

git init
git add .
git commit -m "Initial commit: TÜBİTAK 2237 proje sitesi"

# GitHub'da yeni boş repo oluşturun (README eklemeyin), sonra:
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
git push -u origin main
```

> `.env` dosyası Git’e gitmez (güvenlik). Sırlar yalnızca Vercel’de tanımlanır.

---

## C) Turso veritabanı (admin + tüm içerik)

1. https://turso.tech → giriş  
2. **Create Database** → bölge: `aws-eu-central-1` (Frankfurt) veya size yakın  
3. Database → **Settings** / connect bilgileri:
   - `TURSO_DATABASE_URL` → `libsql://....turso.io`
   - `TURSO_AUTH_TOKEN` → Create Token  
4. Migration’ları Turso’ya uygulayın (proje klasöründe):

```powershell
$env:TURSO_DATABASE_URL="libsql://SIZIN-DB.turso.io"
$env:TURSO_AUTH_TOKEN="SIZIN-TOKEN"
npm run db:turso-migrate
```

5. Admin hesabı oluşturun (içeriği silmez):

```powershell
$env:TURSO_DATABASE_URL="libsql://SIZIN-DB.turso.io"
$env:TURSO_AUTH_TOKEN="SIZIN-TOKEN"
$env:ADMIN_EMAIL="merictuncel@gmail.com"
$env:ADMIN_PASSWORD="GucluSifreniz"
npm run db:create-admin
```

Yedekteki metinleri / programı / eğitmenleri canlı **Admin paneli**nden yeniden girin; foto ve PDF’leri tekrar yükleyin (Vercel Blob’a kaydolur).

---

## D) Vercel Blob (galeri, belgeler, eğitmen fotoğrafları)

1. Vercel Dashboard → projeniz (veya Account) → **Storage** → **Create** → **Blob**  
2. Token oluşturun → `BLOB_READ_WRITE_TOKEN` değerini kopyalayın  

---

## E) Vercel’e bağlama (site + admin portalı)

1. https://vercel.com/new  
2. **Import** → GitHub reponuzu seçin  
3. Framework: **Next.js** (otomatik)  
4. **Environment Variables** ekleyin:

| Name | Value |
|---|---|
| `NEXTAUTH_URL` | İlk deploy sonrası `https://PROJE.vercel.app` (deploy bitince güncelleyin) |
| `NEXTAUTH_SECRET` | Ürettiğiniz uzun gizli anahtar |
| `TURSO_DATABASE_URL` | `libsql://...` |
| `TURSO_AUTH_TOKEN` | Turso token |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |
| `DATABASE_URL` | `file:./dev.db` (build sırasında Prisma generate için; runtime Turso kullanır) |
| `ADMIN_EMAIL` | (opsiyonel, seed için) |
| `ADMIN_PASSWORD` | (opsiyonel, seed için) |

5. **Deploy**  
6. Deploy bitince gerçek URL’yi alın (ör. `https://tubitak-2237.vercel.app`)  
7. Vercel → Settings → Environment Variables → `NEXTAUTH_URL` = tam `https://...` adresi  
8. **Redeploy** (Deployments → … → Redeploy)

---

## F) Canlı kontrol (site + admin)

**Site portalı**
- `https://PROJE.vercel.app`  
- Menü: Program, Eğitmenler, Duyurular, Galeri, Başvuru, İletişim vb.

**Admin portalı**
- `https://PROJE.vercel.app/admin/login`  
- E-posta / şifre: seed’de verdiğiniz (`merictuncel@gmail.com` vb.)  
- Giriş sonrası: ayarlar, başvuru, program, eğitmen, duyuru, SSS, belge, galeri

Kontrol listesi:
- [ ] Ana sayfa açılıyor (HTTPS)  
- [ ] Admin girişi çalışıyor  
- [ ] Galeri görsel yükleme  
- [ ] Belge (PDF) yükleme  
- [ ] Duyuru / pop-up  
- [ ] Başvuru koşulları kaydı  

---

## G) Özel alan adı (isteğe bağlı, sonra)

1. Domain’i alın  
2. Vercel → Project → Settings → Domains → ekleyin  
3. DNS’te Vercel’in verdiği kayıtları girin  
4. SSL otomatik (Let’s Encrypt)  
5. `NEXTAUTH_URL` = `https://alanadiniz.com` → Redeploy  

---

## H) Güncelleme akışı

Kod değişince:

```powershell
git add .
git commit -m "Açıklama"
git push
```

Vercel GitHub’dan otomatik yeniden yayınlar.  
İçerik güncellemeleri için deploy gerekmez — **Admin paneli** yeterlidir.

---

## Sorun giderme

| Sorun | Çözüm |
|---|---|
| Admin girişi olmuyor | `NEXTAUTH_URL` canlı HTTPS mi? Secret doğru mu? Redeploy yaptınız mı? |
| DB hatası | Turso URL/token; `npm run db:turso-migrate` çalıştı mı? |
| Görsel yüklenmiyor | `BLOB_READ_WRITE_TOKEN` Vercel env’de mi? |
| Build fail Prisma | `DATABASE_URL=file:./dev.db` env’de tanımlı olsun |
| Eski admin@proje.com | Canlıda kullanmayın; güçlü hesapla seed edin |

---

## Özet (tek bakış)

1. GitHub’a push  
2. Turso DB + migrate (+ admin seed)  
3. Vercel Blob token  
4. Vercel ← GitHub import + env  
5. `NEXTAUTH_URL` düzelt → redeploy  
6. Site: `/` · Admin: `/admin/login`  
