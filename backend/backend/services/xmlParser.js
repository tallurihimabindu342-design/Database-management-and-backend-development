/**
 * Minimal RSS <item> extractor using regex.
 * Node has no built-in DOMParser (that's browser-only), and pulling in a
 * full XML library is unnecessary for parsing a simple, well-formed RSS feed
 * like WHO's. This is a deliberately narrow, dependency-free parser scoped
 * to exactly what WHO's feed structure provides.
 */

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!match) return "";
  return stripCDATA(match[1]).trim();
}

function stripCDATA(text) {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1");
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, "").trim();
}

export const XMLParser = {
  extractItems(xmlText) {
    const itemBlocks = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];

    return itemBlocks.map((block) => ({
      title: extractTag(block, "title"),
      description: stripHtml(extractTag(block, "description")),
      link: extractTag(block, "link"),
      pubDate: extractTag(block, "pubDate"),
    }));
  },
};
