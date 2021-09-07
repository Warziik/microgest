/* eslint-disable @typescript-eslint/no-var-requires */

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/fr";
import countries from "i18n-iso-countries";

countries.registerLocale(require("i18n-iso-countries/langs/fr.json"));

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.locale("fr");
