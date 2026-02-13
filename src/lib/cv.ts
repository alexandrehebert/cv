import showdown from "showdown";
import { load } from "js-yaml";
import { format, parse } from "date-fns";
import { fr, enUS as en } from "date-fns/locale";

import enYaml from "../data/en.yaml?raw";
import frYaml from "../data/fr.yaml?raw";

export type Locale = "en" | "fr";
export const locales: Locale[] = ["en", "fr"];

const rawYamlByLocale = { en: enYaml, fr: frYaml } as const;

const dataEn = load(enYaml) as Record<string, unknown>;
const dataFr = load(frYaml) as Record<string, unknown>;
const dataByLocale = { en: dataEn, fr: dataFr } as const;
const dateLocales = { fr, en } as const;
const converter = new showdown.Converter();

export type CvData = typeof dataEn;

export function getCvData(locale: Locale): CvData {
  return dataByLocale[locale] ?? dataEn;
}

export function md(text: string): string {
  return converter.makeHtml(text ?? "");
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
