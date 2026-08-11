import { AnnouncementPopup } from "@/components/AnnouncementPopup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPopupAnnouncement, getSiteSettings } from "@/lib/data";

export const revalidate = 60;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, popup] = await Promise.all([
    getSiteSettings(),
    getPopupAnnouncement(),
  ]);

  return (
    <>
      <SiteHeader applicationFormUrl={settings?.applicationFormUrl} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <AnnouncementPopup
        announcement={
          popup
            ? {
                id: popup.id,
                title: popup.title,
                content: popup.content,
                publishedAt: popup.publishedAt,
                linkPath: popup.linkPath,
              }
            : null
        }
      />
    </>
  );
}
