import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-navy-mid bg-navy text-white">
      <div className="container-page py-12 sm:py-14">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <a
                href="https://tubitak.gov.tr/tr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-36 w-full items-center justify-center rounded-2xl bg-white px-4 shadow-sm transition hover:opacity-95 sm:h-40"
                aria-label="TÜBİTAK resmi web sitesi"
              >
                <Image
                  src="/tubitak-logo.png"
                  alt="TÜBİTAK"
                  width={240}
                  height={310}
                  className="h-auto max-h-28 w-auto max-w-[85%] object-contain sm:max-h-32"
                  unoptimized
                />
              </a>
              <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-white px-4 shadow-sm sm:h-40">
                <Image
                  src="/projelogo.png"
                  alt="Program Okuryazarlığı Eğitimi"
                  width={646}
                  height={274}
                  className="h-auto max-h-24 w-auto max-w-[90%] object-contain sm:max-h-28"
                  unoptimized
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-silver">
                TÜBİTAK 2237-A
              </p>
              <p className="mt-1 text-xs text-white/60">
                Bilimsel Eğitim Etkinliklerini Destekleme Programı
              </p>
            </div>
          </div>

          <blockquote className="w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 px-4 py-5 sm:px-8 sm:py-6">
            <p className="text-center text-[0.8rem] leading-relaxed text-silver sm:text-sm sm:leading-7 md:text-[0.95rem]">
              <span className="block whitespace-normal sm:whitespace-nowrap">
                Bu etkinlik,{" "}
                <span className="font-medium text-white">
                  TÜBİTAK 2237-A Bilimsel Eğitim Etkinliklerini Destekleme
                  Programı
                </span>{" "}
                kapsamında sunulmuştur.
              </span>
              <span className="mt-1 block">
                Değerlendirme süreci devam etmektedir.
              </span>
            </p>
          </blockquote>

          <div className="flex flex-col items-center gap-4">
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
              <Link href="/" className="transition hover:text-white">
                Ana Sayfa
              </Link>
              <Link href="/hakkinda" className="transition hover:text-white">
                Hakkında
              </Link>
              <Link href="/program" className="transition hover:text-white">
                Program
              </Link>
              <Link href="/egitmenler" className="transition hover:text-white">
                Eğitmenler
              </Link>
              <Link href="/duyurular" className="transition hover:text-white">
                Duyurular
              </Link>
              <Link href="/iletisim" className="transition hover:text-white">
                İletişim
              </Link>
            </nav>

            <nav
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/50"
              aria-label="İkincil bağlantılar"
            >
              <Link href="/basvuru-kosullari" className="transition hover:text-white/80">
                Başvuru Koşulları
              </Link>
              <Link href="/sss" className="transition hover:text-white/80">
                SSS
              </Link>
              <Link href="/belgeler" className="transition hover:text-white/80">
                Belgeler
              </Link>
              <Link href="/ulasim" className="transition hover:text-white/80">
                Ulaşım
              </Link>
              <Link href="/galeri" className="transition hover:text-white/80">
                Galeri
              </Link>
              <Link href="/kvkk" className="transition hover:text-white/80">
                KVKK
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
