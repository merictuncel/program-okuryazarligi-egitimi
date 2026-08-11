import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";

function createPrisma() {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (tursoUrl?.startsWith("libsql://")) {
    return new PrismaClient({
      adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }),
    });
  }
  return new PrismaClient();
}

const prisma = createPrisma();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim() || "admin@proje.com";
  const password = process.env.ADMIN_PASSWORD?.trim() || "Admin123!";
  const usingDefaults =
    !process.env.ADMIN_EMAIL?.trim() || !process.env.ADMIN_PASSWORD?.trim();

  if (usingDefaults && process.env.NODE_ENV === "production") {
    throw new Error(
      "Üretim ortamında ADMIN_EMAIL ve ADMIN_PASSWORD ortam değişkenlerini ayarlayın.",
    );
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: passwordHash,
      name: "Site Yöneticisi",
    },
    create: {
      email,
      password: passwordHash,
      name: "Site Yöneticisi",
    },
  });

  const settingsData = {
    title:
      "Örgün Pedagojik Formasyon Öğrencileri İçin Program Okuryazarlığı Eğitimi",
    purpose:
      "Bu etkinlik, örgün pedagojik formasyon programı kapsamındaki öğretmen adaylarının program okuryazarlığı kazanmalarını ve öğretim programlarını pedagojik bir bakış açısıyla analiz etme becerilerini geliştirmeyi amaçlamaktadır. Öğretmen adaylarına, program geliştirme sürecinin temel aşamaları (ihtiyaç analizi, hedef ve kazanım belirleme, içerik düzenleme, eğitim durumu tasarımı ve değerlendirme) aktarılacaktır.",
    scope:
      "Hedef Kitle: Türkiye’deki üniversitelerde örgün pedagojik formasyon programına dâhil olan ve 'Eğitimde Program Geliştirme' seçmeli dersini almayan lisans düzeyindeki öğrenciler.",
    startDate: "11-17 Ocak 2027",
    endDate: null as string | null,
    location: "Bolu Abant İzzet Baysal Üniversitesi Eğitim Fakültesi",
    organizingCommittee:
      "Proje Yürütücüsü: Dr. Öğr. Üyesi Meriç TUNCEL — Bolu Abant İzzet Baysal Üniversitesi Eğitim Bilimleri Bölümü, Eğitimde Program Geliştirme Anabilim Dalı",
    scientificCommittee:
      "Bilim kurulu üyeleri kesinleştikten sonra bu alanda duyurulacaktır.",
    applicationFormUrl: "#",
    contactName: "Meriç TUNCEL",
    contactTitle: "Dr. Öğr. Üyesi",
    contactRole: "Proje Yürütücüsü",
    contactEmail: "merictuncel@gmail.com",
    contactPhone: null as string | null,
    contactInstitution:
      "Bolu Abant İzzet Baysal Üniversitesi Eğitim Bilimleri Bölümü, Eğitimde Program Geliştirme Anabilim Dalı",
    contactNote:
      "Proje ile ilgili soru ve taleplerinizi proje yürütücüsüne e-posta yoluyla iletebilirsiniz.",
    applicationCriteria:
      "Başvuru koşulları, proje değerlendirme sürecinin tamamlanmasının ardından bu sayfada ayrıntılı olarak yayımlanacaktır.\n\nGenel çerçeve:\n- Hedef kitle: örgün pedagojik formasyon programındaki lisans öğrencileri\n- Kontenjan, zorunlu belgeler ve son başvuru tarihi destek kararı sonrası duyurulacaktır\n- Başvurular açıldığında bu sitedeki başvuru butonu ve Google Form bağlantısı etkinleştirilecektir",
    kvkkText:
      "Bu site üzerinden iletişim ve başvuru süreçlerinde paylaşılan kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında yalnızca proje bilgilendirme ve başvuru değerlendirme amaçlarıyla işlenir.\n\nVeriler, yasal saklama süreleri boyunca muhafaza edilir; üçüncü kişilerle pazarlama amacıyla paylaşılmaz. Başvuru formu Google Form üzerinden alındığında Google’ın veri işleme koşulları da geçerlidir.\n\nHaklarınız: bilgi talep etme, düzeltme, silme ve itiraz. Başvurularınız için iletişim sayfasındaki proje yürütücüsüne yazabilirsiniz.\n\nAyrıntılı aydınlatma metni, başvurular açılmadan önce güncellenebilir.",
    travelInfo:
      "Ulaşım ve konaklama bilgileri, etkinlik yerinin ve takvimin kesinleşmesinin ardından bu sayfada yayımlanacaktır.\n\nŞimdilik planlanan yer: Bolu Abant İzzet Baysal Üniversitesi Eğitim Fakültesi.\nŞehirlerarası ulaşım, kampüs içi yönlendirme ve (varsa) konaklama seçenekleri destek sürecinin ardından duyurulacaktır.",
    certificateInfo:
      "Katılım belgesi / sertifika süreçleri etkinlik tamamlandıktan sonra bu bölümde duyurulacaktır.",
  };

  const existingSettings = await prisma.siteSettings.findFirst();
  if (existingSettings) {
    await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: settingsData,
    });
  } else {
    await prisma.siteSettings.create({ data: settingsData });
  }

  // Tam seed yalnızca yerel / bilinçli sıfırlamada; Turso’da içerik varsa silme
  const wipeContent = process.env.SEED_WIPE_CONTENT === "true";
  if (wipeContent || !tursoMode()) {
    await prisma.instructor.deleteMany();
    await prisma.instructor.createMany({
      data: [
        {
          name: "Meriç TUNCEL",
          title: "Dr. Öğr. Üyesi",
          biography:
            "Proje Yürütücüsü. Bolu Abant İzzet Baysal Üniversitesi Eğitim Bilimleri Bölümü, Eğitimde Program Geliştirme Anabilim Dalı öğretim üyesidir; uzmanlık alanı eğitimde program geliştirmedir.",
          photoUrl: "/images/default-avatar.png",
          order: 1,
        },
        {
          name: "Alperen YANDI",
          title: "Doç. Dr.",
          biography:
            "Eğitmen. Diğer eğitmenler görüşmeler yapıldıktan sonra eklenecektir.",
          photoUrl: "/images/default-avatar.png",
          order: 2,
        },
      ],
    });

    await prisma.announcement.deleteMany();
    await prisma.announcement.create({
      data: {
        title: "Değerlendirme süreci devam etmektedir",
        content:
          "Bu etkinlik, TÜBİTAK 2237-A Bilimsel Eğitim Etkinliklerini Destekleme Programı kapsamında sunulmak üzere planlanmaktadır. Proje desteklenmesi halinde başvuru süreci bu siteden duyurulacaktır.",
        isActive: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Seed tamamlandı.");
  console.log(`Admin e-posta: ${email}`);
  if (usingDefaults) {
    console.log(
      "Admin şifre: Admin123!  (Üretimde ADMIN_EMAIL / ADMIN_PASSWORD kullanın)",
    );
  } else {
    console.log("Admin şifre: [ADMIN_PASSWORD ortam değişkeninden]");
  }
}

function tursoMode() {
  return Boolean(process.env.TURSO_DATABASE_URL?.trim()?.startsWith("libsql://"));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
