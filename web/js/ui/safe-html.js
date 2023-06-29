// https://github.com/AntonioVdlC/html-template-tag

const chars = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
};

// Dynamically create a RegExp from the `chars` object
const re = new RegExp(Object.keys(chars).join("|"), "g");

// Return the escaped string
function escape(str) {
  return String(str).replace(re, (match) => chars[match]);
}

function html(
  literals,
  ...substs
) {
  return literals.raw.reduce((acc, lit, i) => {
    let subst = substs[i - 1];
    if (Array.isArray(subst)) {
      subst = subst.join("");
    } else if (literals.raw[i - 1] && literals.raw[i - 1].endsWith("$")) {
      // If the interpolation is preceded by a dollar sign,
      // substitution is considered safe and will not be escaped
      acc = acc.slice(0, -1);
    } else {
      subst = escape(subst);
    }

    return acc + subst + lit;
  });
}
