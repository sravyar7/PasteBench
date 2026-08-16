/**
 * The single registry of tools. The homepage grid, the footer, the sitemap
 * and the related-tool links all read from here, so adding a tool is one
 * edit rather than four that drift apart.
 */

export type Category = 'developer' | 'content' | 'image' | 'converter';

export type Tool = {
  id: string;
  name: string;
  category: Category;
  description: string;
};

export const CATEGORIES: { id: Category; name: string; blurb: string }[] = [
  { id: 'developer', name: 'Developer', blurb: 'Formatters, encoders, and validators' },
  { id: 'content', name: 'Text', blurb: 'Counting, casing, and cleaning up copy' },
  { id: 'image', name: 'Image', blurb: 'Colour, QR codes, and compression' },
  { id: 'converter', name: 'Convert', blurb: 'Units, formats, and random values' },
];

export const TOOLS: Tool[] = [
  // Developer
  { id: 'json-formatter', name: 'JSON Formatter', category: 'developer', description: 'Pretty-print, minify, and catch syntax errors with a line number' },
  { id: 'base64-encoder', name: 'Base64', category: 'developer', description: 'Round-trip text and Base64 in either direction' },
  { id: 'url-encoder', name: 'URL Encoder', category: 'developer', description: 'Percent-encoding for query strings and path segments' },
  { id: 'code-beautifier', name: 'Code Beautifier', category: 'developer', description: 'Re-indent JavaScript, JSON, HTML, and XML' },
  { id: 'regex-tester', name: 'Regex Tester', category: 'developer', description: 'Match a pattern against sample text as you type' },
  { id: 'hash-generator', name: 'Hash Generator', category: 'developer', description: 'SHA-1 through SHA-512, computed as you type' },
  { id: 'html-encoder', name: 'HTML Entities', category: 'developer', description: 'Escape angle brackets, quotes, and ampersands' },
  { id: 'xml-formatter', name: 'XML Formatter', category: 'developer', description: 'Indent nested XML and spot unclosed tags' },
  { id: 'timestamp-converter', name: 'Timestamp Converter', category: 'developer', description: 'Unix epoch to a readable date, and back again' },
  { id: 'jwt-decoder', name: 'JWT Decoder', category: 'developer', description: 'Read the header and claims out of a token' },
  { id: 'base-converter', name: 'Number Base', category: 'developer', description: 'Binary, octal, decimal, and hex side by side' },
  { id: 'cron-parser', name: 'Cron Parser', category: 'developer', description: 'Read a cron schedule back in plain English' },
  { id: 'url-parser', name: 'URL Parser', category: 'developer', description: 'Split a URL into parts and read its query string' },

  // Text
  { id: 'word-counter', name: 'Word Counter', category: 'content', description: 'Words, characters, and sentences, counted live' },
  { id: 'case-converter', name: 'Case Converter', category: 'content', description: 'camelCase, snake_case, kebab-case, Title Case' },
  { id: 'slug-generator', name: 'Slug Generator', category: 'content', description: 'Turn a headline into a clean URL segment' },
  { id: 'markdown-editor', name: 'Markdown Editor', category: 'content', description: 'Write Markdown, watch the HTML update beside it' },
  { id: 'meta-tag-generator', name: 'Meta Tags', category: 'content', description: 'Build the title, description, and OG tags for a page' },
  { id: 'plagiarism-checker', name: 'Duplicate Text', category: 'content', description: 'Compare two passages and see what overlaps' },
  { id: 'text-diff', name: 'Text Diff', category: 'content', description: 'Line-by-line comparison of two versions' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', category: 'content', description: 'Placeholder paragraphs, sentences, or words' },
  { id: 'line-tools', name: 'Sort & Dedupe', category: 'content', description: 'Sort lines, drop duplicates, strip blanks' },

  // Image
  { id: 'qr-code-generator', name: 'QR Code Generator', category: 'image', description: 'Encode a link or a note into a scannable code' },
  { id: 'qr-code-decoder', name: 'QR Code Reader', category: 'image', description: 'Read the text back out of a QR image' },
  { id: 'color-converter', name: 'Color Converter', category: 'image', description: 'HEX, RGB, and HSL side by side' },
  { id: 'color-palette', name: 'Color Palette', category: 'image', description: 'Build a palette around one base color' },
  { id: 'image-compressor', name: 'Image Compressor', category: 'image', description: 'Shrink JPG and PNG files before you ship them' },

  // Convert
  { id: 'json-to-csv', name: 'JSON to CSV', category: 'converter', description: 'Flatten an array of objects into spreadsheet rows' },
  { id: 'csv-to-json', name: 'CSV to JSON', category: 'converter', description: 'Turn spreadsheet rows into an array of objects' },
  { id: 'unit-converter', name: 'Unit Converter', category: 'converter', description: 'Length, weight, and volume across metric and imperial' },
  { id: 'temperature-converter', name: 'Temperature', category: 'converter', description: 'Celsius, Fahrenheit, and Kelvin' },
  { id: 'password-generator', name: 'Password Generator', category: 'converter', description: 'Random strings with the character sets you pick' },
  { id: 'random-generator', name: 'Random Values', category: 'converter', description: 'Numbers, strings, and throwaway IDs on demand' },
];

export const toolHref = (tool: Tool) => `/tools/${tool.category}/${tool.id}`;

export const getTool = (id: string) => TOOLS.find((t) => t.id === id);

export const categoryName = (id: Category) =>
  CATEGORIES.find((c) => c.id === id)?.name ?? id;

/** Same-category siblings, wrapping around so every tool gets a full set. */
export function relatedTools(id: string, count = 4): Tool[] {
  const tool = getTool(id);
  if (!tool) return TOOLS.slice(0, count);

  const siblings = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== id
  );
  const others = TOOLS.filter((t) => t.category !== tool.category && t.id !== id);

  return [...siblings, ...others].slice(0, count);
}
