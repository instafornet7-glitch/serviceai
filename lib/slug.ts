const arabicTransliteration: Record<string, string> = {
  ا: "a", أ: "a", إ: "i", آ: "a", ٱ: "a", ء: "", ؤ: "w", ئ: "y",
  ب: "b", ت: "t", ث: "th", ج: "j", ح: "h", خ: "kh", د: "d", ذ: "dh",
  ر: "r", ز: "z", س: "s", ش: "sh", ص: "s", ض: "d", ط: "t", ظ: "z",
  ع: "a", غ: "gh", ف: "f", ق: "q", ك: "k", ل: "l", م: "m", ن: "n",
  ه: "h", ة: "a", و: "w", ى: "a", ي: "y", پ: "p", چ: "ch", ژ: "zh", گ: "g",
};

export function slugify(value: string): string {
  const transliterated = Array.from(value.normalize("NFKD"), (character) => {
    if (/[٠-٩]/.test(character)) return String("٠١٢٣٤٥٦٧٨٩".indexOf(character));
    return arabicTransliteration[character] ?? character;
  }).join("");

  return transliterated
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
