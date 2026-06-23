const fs = require("fs");
const path = require("path");

const files = ["index.html", "contact.html", "about.html"];

const replacements = [
  {
    from: /<wa-icon name="instagram" family="brands"><\/wa-icon>|<wa-icon name="instagram" family="brands"\s*><\/wa-icon>|<wa-icon name="instagram" family="brands">/g,
    to: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" style="display:block"><path fill="currentColor" d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4ZM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6Zm6.2-2.2a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"/></svg>',
  },
  {
    from: /<wa-icon name="facebook" family="brands"><\/wa-icon>|<wa-icon name="facebook" family="brands"\s*><\/wa-icon>|<wa-icon name="facebook" family="brands">/g,
    to: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" style="display:block"><path fill="currentColor" d="M13.5 22v-8h2.7l.4-3H13.5V9.2c0-.8.2-1.3 1.4-1.3H16.7V5.2c-.6-.1-1.8-.2-3.1-.2c-2.8 0-4.7 1.7-4.7 4.8V11H6v3h3v8h4.5Z"/></svg>',
  },
  {
    from: /<wa-icon name="whatsapp" family="brands"><\/wa-icon>|<wa-icon name="whatsapp" family="brands"\s*><\/wa-icon>|<wa-icon name="whatsapp" family="brands">/g,
    to: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" style="display:block"><path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 .02 5.35.02 11.98c0 2.1.55 4.14 1.6 5.95L0 24l6.24-1.62a12 12 0 0 0 5.76 1.47h.02c6.63 0 11.98-5.35 11.98-11.98c0-3.17-1.25-6.21-3.48-8.39ZM12.02 21.6h-.02c-1.8 0-3.56-.48-5.11-1.39l-.36-.21l-3.09.8l.84-3.02l-.23-.37a9.77 9.77 0 0 1-1.48-5.23C3.57 5.86 7.7 1.73 12.02 1.73c2.1 0 4.08.82 5.57 2.31A9.82 9.82 0 0 1 21.31 9.6c0 5.31-4.3 12-9.29 12Zm5.4-7.91c-.3-.15-1.78-.88-2.06-.98c-.28-.1-.46-.15-.66.15c-.2.3-.76.98-.93 1.18c-.17.2-.34.23-.64.08c-.3-.15-1.26-.46-2.4-1.48c-.89-.8-1.48-1.79-1.65-2.09c-.17-.3-.02-.46.13-.61c.14-.14.3-.34.45-.51c.15-.17.2-.28.3-.46c.1-.18.05-.35-.02-.5c-.08-.15-.66-1.58-.9-2.17c-.24-.58-.48-.5-.66-.51h-.56c-.18 0-.46.07-.7.35c-.24.28-.92.9-.92 2.19s.94 2.55 1.07 2.72c.13.17 1.85 2.82 4.48 3.95c.63.27 1.12.43 1.5.55c.63.2 1.2.17 1.65.1c.5-.07 1.78-.73 2.03-1.44c.25-.71.25-1.32.17-1.44c-.08-.12-.28-.2-.58-.35Z"/></svg>',
  },
];

for (const f of files) {
  const p = path.join(process.cwd(), f);
  let html = fs.readFileSync(p, "utf8");
  const before = html;

  for (const r of replacements) {
    html = html.replace(r.from, r.to);
  }

  if (html !== before) {
    fs.writeFileSync(p, html, "utf8");
    console.log(`Updated ${f}`);
  } else {
    console.log(`No changes for ${f}`);
  }
}
