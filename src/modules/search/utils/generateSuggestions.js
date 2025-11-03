import siteContent from "../../../data/siteContent.json";
export default function generateSuggestions() {
  const menuTitles = siteContent.header.menu.map((m) => m.title);
  const productNames = siteContent.products
    ? siteContent.products.map((p) => p.name)
    : [];
  const suggestions = [...menuTitles, ...productNames];
  return [...new Set(suggestions)];
}
