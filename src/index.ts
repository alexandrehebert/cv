import pug from 'pug'
import showdown from 'showdown'
import {format, parse} from 'date-fns'
import {fr, enUS as en} from 'date-fns/locale'

import dataEn from './data/en.json'
import dataFr from './data/fr.json'

const compiledFunction = pug.compileFile('src/index.pug')
const showdownConverter = new showdown.Converter()

type Locale = "en" | "fr"
const locales: Locale[] = ["en", "fr"]
const locale: Locale = process.env.LOCALE as Locale ?? "en"

const dateLocales = {fr, en}
const experiences = {fr: dataFr, en: dataEn}

console.log(compiledFunction({
    ...(experiences[locale] ?? {}),
    locales,
    currentLocale: locale,
    md: (text: string) => showdownConverter.makeHtml(text),
    period: (date: string) => format(date ? parse(date, "yyyy-MM", new Date()) : new Date(), "LLL yyyy", {locale: dateLocales[locale]})
}))
