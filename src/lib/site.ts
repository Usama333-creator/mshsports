/**
 * Business contact details — EDIT THESE before going live.
 * whatsapp: country code + number, digits only (e.g. Pakistan 0300 1234567 -> "923001234567")
 */
export const site = {
  name: "Mashal Olympics Sports Wear",
  whatsapp: "923000000000",
  email: "info@mashalolympics.com",
  instagram: "https://instagram.com/mashalolympics",
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
