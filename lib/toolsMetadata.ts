import { BRAND } from './brand';

/**
 * Per-tool SEO copy.
 *
 * Rules that keep this from reading like filler:
 *  - Lead the description with what the tool does to your input, not with
 *    "Free online tool that…".
 *  - Vary the sentence shape. If every entry has the same rhythm, the set
 *    reads as generated regardless of how accurate each line is.
 *  - Name a specific capability (line + column, padding, indent width) so
 *    the description says something a competitor's copy doesn't.
 *  - Keep descriptions under ~155 chars so search results don't truncate.
 */

export const TOOLS_METADATA = {
  // --- Developer ---
  'json-formatter': {
    title: 'JSON Formatter and Validator',
    description:
      'Re-indent JSON, collapse it to a single line, or find the exact line and column where the syntax breaks.',
    keywords: 'json formatter, json validator, json beautifier, format json, minify json',
  },
  'base64-encoder': {
    title: 'Base64 Encoder and Decoder',
    description:
      'Convert text to Base64, or read an encoded string back to plain text. Padding is handled for you.',
    keywords: 'base64 encoder, base64 decoder, encode base64, decode base64',
  },
  'url-encoder': {
    title: 'URL Encoder and Decoder',
    description:
      'Percent-encode text for query strings and path segments, or decode a URL that arrived escaped.',
    keywords: 'url encoder, url decoder, percent encoding, encode url, decode url',
  },
  'code-beautifier': {
    title: 'Code Beautifier for JavaScript, JSON, HTML and XML',
    description:
      'Re-indent minified or badly formatted code. Choose the language and indent width, then paste.',
    keywords: 'code beautifier, code formatter, format javascript, beautify code, pretty print',
  },
  'regex-tester': {
    title: 'Regex Tester with Live Matching',
    description:
      'Write a pattern and watch what it matches in your sample text as you type. Supports the usual flags.',
    keywords: 'regex tester, regular expression tester, test regex, regex matcher',
  },
  'hash-generator': {
    title: 'SHA Hash Generator',
    description:
      'SHA-1, SHA-256, SHA-384 and SHA-512 digests for any string, computed as you type.',
    keywords: 'hash generator, sha256 generator, sha512, checksum, digest generator',
  },
  'html-encoder': {
    title: 'HTML Entity Encoder and Decoder',
    description:
      'Escape angle brackets, quotes, and ampersands so markup renders as text — or reverse it.',
    keywords: 'html encoder, html decoder, html entities, escape html',
  },
  'xml-formatter': {
    title: 'XML Formatter',
    description:
      'Indent nested XML so the structure is readable, and spot the tag you forgot to close.',
    keywords: 'xml formatter, xml beautifier, format xml, indent xml',
  },

  'timestamp-converter': {
    title: 'Unix Timestamp Converter',
    description:
      'Convert a Unix epoch to a readable date and back, in local time or UTC. Handles seconds and milliseconds.',
    keywords: 'unix timestamp converter, epoch converter, epoch to date, timestamp to date',
  },
  'jwt-decoder': {
    title: 'JWT Decoder',
    description:
      'Read the header and payload of a JSON Web Token, with expiry and issued-at shown as real dates.',
    keywords: 'jwt decoder, decode jwt, json web token decoder, jwt parser',
  },
  'base-converter': {
    title: 'Number Base Converter',
    description:
      'Convert between binary, octal, decimal, and hexadecimal. Type in any field and the rest follow.',
    keywords: 'number base converter, hex to decimal, binary to decimal, decimal to hex',
  },

  'cron-parser': {
    title: 'Cron Expression Parser',
    description:
      'Paste a cron schedule and read back what it actually runs, in plain English, with each field explained.',
    keywords: 'cron parser, cron expression, crontab explained, cron schedule reader',
  },
  'url-parser': {
    title: 'URL Parser and Query String Viewer',
    description:
      'Split a URL into scheme, host, path, and query. Repeated parameters stay separate and escaping is decoded.',
    keywords: 'url parser, query string parser, parse url online, url decoder',
  },

  // --- Text ---
  'word-counter': {
    title: 'Word and Character Counter',
    description:
      'Live counts for words, characters, sentences, lines, and paragraphs as you type or paste.',
    keywords: 'word counter, character counter, count words, text statistics',
  },
  'case-converter': {
    title: 'Case Converter for camelCase, snake_case and more',
    description:
      'Switch text between camelCase, snake_case, kebab-case, Title Case, upper, and lower.',
    keywords: 'case converter, camelcase converter, snake case, kebab case, title case',
  },
  'slug-generator': {
    title: 'URL Slug Generator',
    description:
      'Turn a headline into a clean URL segment: lowercased, hyphenated, punctuation stripped.',
    keywords: 'slug generator, url slug, permalink generator, seo slug',
  },
  'markdown-editor': {
    title: 'Markdown Editor with Live Preview',
    description:
      'Write Markdown on one side and watch the rendered HTML update beside it. Copy either side.',
    keywords: 'markdown editor, markdown preview, markdown to html, md editor',
  },
  'meta-tag-generator': {
    title: 'Meta Tag Generator for SEO and Open Graph',
    description:
      'Fill in a title and description, then copy the meta and Open Graph tags into your page head.',
    keywords: 'meta tag generator, open graph tags, seo meta tags, twitter card',
  },
  'plagiarism-checker': {
    title: 'Duplicate Text Checker',
    description:
      'Compare two passages and see which phrases overlap, with a rough similarity score.',
    keywords: 'duplicate text checker, text similarity, compare text, overlap checker',
  },

  'text-diff': {
    title: 'Text Diff Checker',
    description:
      'Compare two blocks of text line by line and see exactly what was added, removed, or left alone.',
    keywords: 'text diff, diff checker, compare text online, text comparison',
  },
  'lorem-ipsum': {
    title: 'Lorem Ipsum Generator',
    description:
      'Generate placeholder paragraphs, sentences, or words for mockups, with or without the classic opening.',
    keywords: 'lorem ipsum generator, placeholder text, dummy text generator, filler text',
  },

  'line-tools': {
    title: 'Sort Lines and Remove Duplicates',
    description:
      'Sort a list naturally, drop repeated lines, strip blanks and stray whitespace. Handles item2 before item10.',
    keywords: 'remove duplicate lines, sort lines alphabetically, dedupe list, line sorter',
  },

  // --- Image ---
  'qr-code-generator': {
    title: 'QR Code Generator',
    description:
      'Encode a link, a note, or contact details into a QR code you can download and print.',
    keywords: 'qr code generator, make qr code, qr code maker, generate qr',
  },
  'qr-code-decoder': {
    title: 'QR Code Reader',
    description:
      'Upload a QR image and get the text back out of it, without installing a phone app.',
    keywords: 'qr code reader, decode qr code, scan qr code, read qr',
  },
  'color-converter': {
    title: 'Color Converter for HEX, RGB and HSL',
    description:
      'Enter a color in any of the three formats and see the other two update, with a live swatch.',
    keywords: 'color converter, hex to rgb, rgb to hsl, color format converter',
  },
  'color-palette': {
    title: 'Color Palette Generator',
    description:
      'Pick a base color and build a matching set, with hex codes ready to drop into your styles.',
    keywords: 'color palette generator, color scheme, palette maker, hex palette',
  },
  'image-compressor': {
    title: 'Image Compressor',
    description:
      'Shrink JPG and PNG files before you ship them. Compression happens locally, so nothing uploads.',
    keywords: 'image compressor, compress jpg, compress png, reduce image size',
  },

  // --- Convert ---
  'json-to-csv': {
    title: 'JSON to CSV Converter',
    description:
      'Flatten an array of objects into spreadsheet rows, using the object keys as the header line.',
    keywords: 'json to csv, convert json to csv, json csv converter, export json',
  },
  'csv-to-json': {
    title: 'CSV to JSON Converter',
    description:
      'Turn spreadsheet rows into an array of objects, using the header line as keys. Handles quoted fields.',
    keywords: 'csv to json, convert csv to json, csv json converter, parse csv',
  },
  'unit-converter': {
    title: 'Unit Converter',
    description:
      'Convert length, weight, and volume across metric and imperial without the mental arithmetic.',
    keywords: 'unit converter, metric to imperial, length converter, weight converter',
  },
  'temperature-converter': {
    title: 'Temperature Converter',
    description:
      'Celsius, Fahrenheit, and Kelvin, converted as you type into any of the three fields.',
    keywords: 'temperature converter, celsius to fahrenheit, kelvin converter',
  },
  'password-generator': {
    title: 'Password Generator',
    description:
      'Generate a random password at the length you want, using the character sets you choose.',
    keywords: 'password generator, random password, strong password, secure password',
  },
  'random-generator': {
    title: 'Random Number and String Generator',
    description:
      'Produce random numbers, strings, and throwaway IDs for testing and seed data.',
    keywords: 'random generator, random number generator, random string, test data',
  },
};

export function getToolMetadata(toolId: string) {
  return (
    TOOLS_METADATA[toolId as keyof typeof TOOLS_METADATA] || {
      title: BRAND,
      description:
        'Formatters, encoders, and converters that run in your browser.',
      keywords: 'online tools, developer tools',
    }
  );
}
