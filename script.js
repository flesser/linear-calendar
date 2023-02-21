(function drawCalendar(document) {
  const date = new Date();
  const year = Number(document.location.hash.slice(1)) || date.getFullYear();
  date.setFullYear(year);
  date.setHours(12); // to prevent strange things happening if executed exactly around midnight...

  const locale = navigator.language || navigator.userLanguage;

  document.title = `Linear-Kalender für ${year}`;

  const container = document.getElementById("calendar");

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
      dayTitleSpan.append(date.toLocaleString(locale, { weekday: "long" })); // TODO: option short
      dayTitle.append(dayTitleSpan);

      const dayNotes = document.createElement("div");
      dayNotes.className = `day notes weekday-${date.getDay()}`;

      daysWrapper.append(dayNumber, dayTitle, dayNotes);
    }
    month.append(daysWrapper);
    container.append(month);
  }
})(document);
