export const SITE_URL = "https://cynthiamueni.com";

export const SITE_NAME = "Cynthia Mueni";
export const SITE_TITLE = "Cynthia Mueni: Occupational Safety, EHS Systems & Digital Communication";
export const SITE_DESCRIPTION =
  "Cynthia Mueni is an Occupational Safety & Health professional who also builds EHS systems and manages digital communication, helping organisations work more safely, efficiently and visibly.";

// Public-facing professional identity — shown on the site and used as the mailto: fallback.
// The contact form's actual delivery inbox is configured separately (see app/api/contact/route.ts).
export const CONTACT_EMAIL = "hello@cynthiamueni.com";
export const CONTACT_PHONE = "+254 748 810 670";
export const CONTACT_PHONE_HREF = "+254748810670";
export const CONTACT_LOCATION = "Nairobi, Kenya";

export const BUSINESS_HOURS = [
  { days: "Monday to Friday", hours: "8:00 AM to 6:00 PM" },
  { days: "Saturday", hours: "9:00 AM to 1:00 PM" },
] as const;

export const HARUNLUCAS_DEV_URL = "https://harunlucasdev.site/";

export const LINKEDIN_URL = "https://www.linkedin.com/in/cynthia-mueni-6b621b359/";
export const FACEBOOK_URL = "https://www.facebook.com/Cynthia%20Mueni";
export const GITHUB_URL = "https://github.com/cynthia317/";

export const WHATSAPP_NUMBER = "254748810670";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi Cynthia, I found your website and would like to get in touch.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;
