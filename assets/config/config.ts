import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/fr';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale("fr");