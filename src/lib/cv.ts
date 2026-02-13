import showdown from "showdown";
import { load } from "js-yaml";
import { format, parse } from "date-fns";
import { fr, enUS as en } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";

import enYaml from "../data/en.yaml?raw";
import frYaml from "../data/fr.yaml?raw";

export type Locale = "en" | "fr";
export const locales: Locale[] = ["en", "fr"];

export interface Experience {
  company: string;
  location: string;
  role: string;
  contract: string;
  year: string;
  period: {
    from: string;
    to: string;
  };
  shortDescription: string;
  description: string;
  skills?: string[];
  contributions?: string[];
}

export interface Education {
  school: string;
  location: string;
  degree: string;
  specialization: string;
  period: {
    from: string;
    to: string;
  };
}

export interface CvData {
  title: string;
  subTitle: string;
  name: string;
  description: string;
  skills: string[];
  details: string[];
  phones: string[];
  email: string;
  social: string[];
  experiences: Experience[];
  educations: Education[];
}

const rawYamlByLocale = { en: enYaml, fr: frYaml } as const;

const dataEn = load(enYaml) as CvData;
const dataFr = load(frYaml) as CvData;
const dataByLocale = { en: dataEn, fr: dataFr } as const;
const dateLocales = { fr, en } as const;

// Configure Showdown with security-focused options
const converter = new showdown.Converter({
  noHeaderId: true,
  simpleLineBreaks: true,
  ghCompatibleHeaderId: false,
  encodeEmails: true,
  // Disable raw HTML to prevent XSS attacks
  parseImgDimensions: false,
  simplifiedAutoLink: true,
  excludeTrailingPunctuationFromURLs: true,
  literalMidWordUnderscores: true,
  strikethrough: true,
  tables: true,
  tasklists: false,
  ghMentions: false,
  smartIndentationFix: true,
  disableForced4SpacesIndentedSublists: true,
  openLinksInNewWindow: false,
});

export function getCvData(locale: Locale): CvData {
  return dataByLocale[locale] ?? dataEn;
}

export function md(text: string): string {
  const html = converter.makeHtml(text ?? "");
  // Sanitize the HTML output to prevent XSS attacks
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

export function period(locale: Locale, date?: string): string {
  if (!date || date?.includes("-")) {
    return format(
      date ? parse(date, "yyyy-MM", new Date()) : new Date(),
      "LLL yyyy",
      { locale: dateLocales[locale] }
    );
  }

  return date;
}

export function getRawYaml(locale: Locale): string {
  return rawYamlByLocale[locale] ?? rawYamlByLocale.en;
}
