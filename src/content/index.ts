import type { Locale } from "@/lib/i18n";

import * as viHome from "./vi/home";
import * as viBoot from "./vi/boot";
import * as viIaa from "./vi/iaa";
import * as viIaaLoad from "./vi/iaa/load";
import * as viIap from "./vi/iap";
import * as viIapSubscription from "./vi/iap/subscription";
import * as viRemoteConfig from "./vi/remote-config";
import * as viTracking from "./vi/tracking";
import * as viUa from "./vi/ua";
import * as viUaLtv from "./vi/ua/ltv";
import * as viUaCpi from "./vi/ua/cpi";
import * as viUaLaunch from "./vi/ua/launch";
import * as viUaCreative from "./vi/ua/creative";
import * as viUaDiagnose from "./vi/ua/diagnose";
import * as viUaInstrumentation from "./vi/ua/instrumentation";
import * as viUaGlossary from "./vi/ua/glossary";
import * as viDeepPreload from "./vi/deep/preload";
import * as viDeepMatchRate from "./vi/deep/match-rate";
import * as viDeepEcpmDay from "./vi/deep/ecpm-day";
import * as viDeepBidding from "./vi/deep/bidding";
import * as viDeepRevenueGap from "./vi/deep/revenue-gap";
import * as viPlatforms from "./vi/platforms";
import * as viLessons from "./vi/lessons";

import * as enHome from "./en/home";
import * as enBoot from "./en/boot";
import * as enIaa from "./en/iaa";
import * as enIaaLoad from "./en/iaa/load";
import * as enIap from "./en/iap";
import * as enIapSubscription from "./en/iap/subscription";
import * as enRemoteConfig from "./en/remote-config";
import * as enTracking from "./en/tracking";
import * as enUa from "./en/ua";
import * as enUaLtv from "./en/ua/ltv";
import * as enUaCpi from "./en/ua/cpi";
import * as enUaLaunch from "./en/ua/launch";
import * as enUaCreative from "./en/ua/creative";
import * as enUaDiagnose from "./en/ua/diagnose";
import * as enUaInstrumentation from "./en/ua/instrumentation";
import * as enUaGlossary from "./en/ua/glossary";
import * as enDeepPreload from "./en/deep/preload";
import * as enDeepMatchRate from "./en/deep/match-rate";
import * as enDeepEcpmDay from "./en/deep/ecpm-day";
import * as enDeepBidding from "./en/deep/bidding";
import * as enDeepRevenueGap from "./en/deep/revenue-gap";
import * as enPlatforms from "./en/platforms";
import * as enLessons from "./en/lessons";

export type PageModule = {
  default: () => React.ReactElement;
  metadata?: { title: string };
};

/**
 * Every page, in every language, keyed by its locale-free path. The type
 * makes a page that is missing a translation a build error instead of a
 * silent fallback to another language.
 */
export const PAGES = {
  "": { vi: viHome, en: enHome },
  "boot": { vi: viBoot, en: enBoot },
  "iaa": { vi: viIaa, en: enIaa },
  "iaa/load": { vi: viIaaLoad, en: enIaaLoad },
  "iap": { vi: viIap, en: enIap },
  "iap/subscription": { vi: viIapSubscription, en: enIapSubscription },
  "remote-config": { vi: viRemoteConfig, en: enRemoteConfig },
  "tracking": { vi: viTracking, en: enTracking },
  "ua": { vi: viUa, en: enUa },
  "ua/ltv": { vi: viUaLtv, en: enUaLtv },
  "ua/cpi": { vi: viUaCpi, en: enUaCpi },
  "ua/launch": { vi: viUaLaunch, en: enUaLaunch },
  "ua/creative": { vi: viUaCreative, en: enUaCreative },
  "ua/diagnose": { vi: viUaDiagnose, en: enUaDiagnose },
  "ua/instrumentation": { vi: viUaInstrumentation, en: enUaInstrumentation },
  "ua/glossary": { vi: viUaGlossary, en: enUaGlossary },
  "deep/preload": { vi: viDeepPreload, en: enDeepPreload },
  "deep/match-rate": { vi: viDeepMatchRate, en: enDeepMatchRate },
  "deep/ecpm-day": { vi: viDeepEcpmDay, en: enDeepEcpmDay },
  "deep/bidding": { vi: viDeepBidding, en: enDeepBidding },
  "deep/revenue-gap": { vi: viDeepRevenueGap, en: enDeepRevenueGap },
  "platforms": { vi: viPlatforms, en: enPlatforms },
  "lessons": { vi: viLessons, en: enLessons },
} satisfies Record<string, Record<Locale, PageModule>>;

export type Slug = keyof typeof PAGES;
