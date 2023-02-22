const DEFAULT_YEAR = new Date().getFullYear();
const DEFAULT_LOCALE = String(
  navigator.language || navigator.userLanguage
).slice(0, 2);

function parseHash() {
  const fields = document.location.hash.slice(1).split("|");
  var year, locale;

  if (fields.length == 1) {
    year = Number(fields[0]);
  } else {
    year = Number(fields[1]);
    locale = fields[0];
  }

  return { year: year || DEFAULT_YEAR, locale: locale || DEFAULT_LOCALE };
}
function setHash({ year, locale }) {
  const current = parseHash();
  history.pushState(
    null,
    null,
    `#${locale || current.locale}|${year || current.year}`
  );
}

function drawCalendar() {
  const date = new Date();
  const { year, locale } = parseHash();

  date.setFullYear(year);
  date.setHours(12); // to prevent strange things happening if executed exactly around midnight...

  document.title = `Linear-Kalender für ${year}`;
  const container = document.getElementById("calendar");
  container.replaceChildren();

  // generate months 01-12
  for (let m = 0; m < 12; m++) {
    date.setMonth(m, 1);

    const month = document.createElement("div");
    month.className = "month";

    // title bar colors
    month.style.setProperty("--start-hue", 240 - m * 30);
    month.style.setProperty("--end-hue", 240 - (m + 1) * 30);

    // title
    const monthTitle = document.createElement("div");
    monthTitle.className = "title";
    monthTitle.append(date.toLocaleString(locale, { month: "long" }));

    if (m == 0) {
      // add year to January title
      const yearTitle = document.createElement("div");
      yearTitle.className = "year";
      yearTitle.append(year);
      monthTitle.prepend(yearTitle);
    }

    month.append(monthTitle);

    // days
    const lastDayOfMonth = new Date(year, m + 1, 0).getDate();

    const daysWrapper = document.createElement("div");
    daysWrapper.className = "days";
    daysWrapper.style.setProperty("--number-of-days", lastDayOfMonth);

    for (let d = 1; d <= lastDayOfMonth; d++) {
      date.setMonth(m, d);

      const dayNumber = document.createElement("div");
      dayNumber.className = `day number weekday-${date.getDay()}`;
      dayNumber.append(d);

      const dayTitle = document.createElement("div");
      dayTitle.className = `day title weekday-${date.getDay()}`;

      const dayTitleSpan = document.createElement("span");
      dayTitleSpan.append(date.toLocaleString(locale, { weekday: "long" })); // TODO: option for "short"?
      dayTitle.append(dayTitleSpan);

      const dayNotes = document.createElement("div");
      dayNotes.className = `day notes weekday-${date.getDay()}`;

      daysWrapper.append(dayNumber, dayTitle, dayNotes);
    }
    month.append(daysWrapper);
    container.append(month);
  }
}

function setupLocaleInput(localeInput) {
  // const LANGUAGES_LIST is defined in languages.js which has to be included in the same html file

  const supportedLocales = Intl.DateTimeFormat.supportedLocalesOf(
    Object.keys(LANGUAGES_LIST),
    { localeMatcher: "lookup" }
  );

  for (const code of supportedLocales) {
    if (!LANGUAGES_LIST[code]) {
      continue;
    }
    const option = document.createElement("option");
    option.setAttribute("value", code);
    option.append(
      `${LANGUAGES_LIST[code].name} (${LANGUAGES_LIST[code].nativeName})`
    );
    localeInput.append(option);
  }
}

// ----------------------------------------------------------------------------------

(function main() {
  const yearInput = document.getElementById("yearInput");
  const localeInput = document.getElementById("localeInput");
  setupLocaleInput(localeInput);

  const { year, locale } = parseHash();
  yearInput.value = year;
  localeInput.value = locale;

  if (year != DEFAULT_YEAR || locale != DEFAULT_LOCALE) {
    setHash(year, locale);
  }

  window.addEventListener(
    "hashchange",
    ({ newURL, oldURL }) => {
      if (newURL != oldURL) {
        drawCalendar();
      }
    },
    false
  );

  yearInput.addEventListener("input", (e) => {
    setHash({ year: Number(yearInput.value) });
    drawCalendar();
  });

  localeInput.addEventListener("input", (e) => {
    setHash({ locale: localeInput.value });
    drawCalendar();
  });

  drawCalendar();
})();
