/**
 * Questions people actually search, answered specifically.
 *
 * These exist to be useful first — a page of restated marketing copy
 * helps nobody and Google discounts it. Every answer says something
 * concrete: a real limit, a real gotcha, a real reason.
 *
 * A tool with nothing worth explaining gets no entry rather than filler.
 */

export type Faq = { q: string; a: string };

export const TOOL_FAQS: Record<string, Faq[]> = {
  'json-formatter': [
    {
      q: 'Why does my JSON fail with a trailing comma?',
      a: 'JSON is stricter than JavaScript: it has no trailing commas, no comments, and keys must be double-quoted. A trailing comma before } or ] is the single most common cause, and the error message here names the line and column.',
    },
    {
      q: 'What is the difference between formatting and minifying?',
      a: 'Formatting adds indentation and newlines so a human can read the structure. Minifying strips all of it to make the payload as small as possible for transmission. Both produce the same data.',
    },
    {
      q: 'Is my JSON uploaded anywhere?',
      a: 'No. Parsing happens in your browser with the built-in JSON functions. Nothing is transmitted, which is why this works with production payloads you would not paste into a server-side tool.',
    },
  ],

  'base64-encoder': [
    {
      q: 'Is Base64 encryption?',
      a: 'No, and treating it as such is a common security mistake. It is a reversible encoding with no key — anyone can decode it instantly. Use it for transporting binary data through text channels, never for hiding anything.',
    },
    {
      q: 'Why does my Base64 string end in = signs?',
      a: 'Base64 works in three-byte groups. When the input does not divide evenly, one or two = characters pad the final group. They are part of the format and stripping them breaks decoding.',
    },
    {
      q: 'Does this handle accents and emoji?',
      a: 'Yes. The text is converted to UTF-8 before encoding, so characters outside ASCII survive the round trip intact.',
    },
  ],

  'url-encoder': [
    {
      q: 'When do I need to URL-encode something?',
      a: 'Any time a value goes into a query string or path segment and might contain a space, &, ?, #, /, or a non-ASCII character. Unencoded, those characters end the value early and silently truncate your data.',
    },
    {
      q: 'What is the difference between %20 and +?',
      a: 'Both can mean a space, but in different places. %20 is correct everywhere; + only means a space inside application/x-www-form-urlencoded form bodies. In a path segment, + is a literal plus.',
    },
  ],

  'jwt-decoder': [
    {
      q: 'Does this verify the token signature?',
      a: 'No, and no browser tool should. Verification needs your secret or public key, and sending that to a web page would defeat the point. This reads the header and claims only; genuineness has to be checked on your server.',
    },
    {
      q: 'Is it safe to paste a real token here?',
      a: 'The decoding happens entirely in your browser and the token is never transmitted. That said, a JWT is a credential — do not paste a live production token into any web page, including this one, if you cannot verify that claim yourself.',
    },
    {
      q: 'Why can I read the payload without a key?',
      a: 'A JWT payload is base64-encoded, not encrypted. Anyone holding the token can read every claim in it. The signature proves the token was not altered; it does not hide the contents.',
    },
  ],

  'hash-generator': [
    {
      q: 'Can I use SHA-256 to store passwords?',
      a: 'No. Fast hashes are the wrong tool for passwords precisely because they are fast — an attacker can try billions per second. Use bcrypt, scrypt, or Argon2, which are deliberately slow and salted.',
    },
    {
      q: 'Why is there no MD5 option?',
      a: 'Browsers do not ship MD5 in their crypto API, and it is broken for anything security-related. Pulling in a third-party implementation to fill a row on the page was not worth it.',
    },
    {
      q: 'Why include SHA-1 if it is insecure?',
      a: 'Because older systems still ask for it — Git object IDs, legacy integrations, some checksums. It is here for compatibility, and should not be used for anything where collisions matter.',
    },
  ],

  'timestamp-converter': [
    {
      q: 'How do I know if my timestamp is in seconds or milliseconds?',
      a: 'Length is the giveaway: a current epoch in seconds is 10 digits, in milliseconds it is 13. This tool detects it from the magnitude, so pasting either works without you choosing.',
    },
    {
      q: 'What is the Unix epoch?',
      a: 'Midnight UTC on 1 January 1970. Unix timestamps count the seconds elapsed since then, which is why a value of 0 shows as that date and negative values point at earlier ones.',
    },
  ],

  'base-converter': [
    {
      q: 'Why does my large hex value lose digits in other converters?',
      a: 'Most convert through a JavaScript number, which stops being exact above 2^53. This one uses arbitrary-precision integers, so 64-bit register values and IDs convert without silently rounding.',
    },
    {
      q: 'What do the 0x and 0b prefixes mean?',
      a: 'They are source-code conventions marking hexadecimal and binary literals. You do not need to type them here — pick the field and enter the digits.',
    },
  ],

  'cron-parser': [
    {
      q: 'Why does my cron job run more often than expected?',
      a: 'Most often because both day-of-month and day-of-week are set. In standard cron those combine with OR, not AND — "0 0 13 * 5" fires on the 13th *and* every Friday, not only Friday the 13th.',
    },
    {
      q: 'My expression has six fields and is rejected. Why?',
      a: 'Six fields means a leading seconds column, which Quartz and Spring support but standard Unix cron does not. Drop the first field to get the five-field form.',
    },
  ],

  'url-parser': [
    {
      q: 'What happens to repeated query parameters?',
      a: 'They are kept separately. ?size=42&size=43 is legal and meaningful — many frameworks read it as an array — so collapsing it to one value would hide real data.',
    },
    {
      q: 'Why does my URL fail to parse without https://?',
      a: 'A URL needs a scheme to be a URL rather than a path. example.com/page is ambiguous; https://example.com/page is not.',
    },
  ],

  'line-tools': [
    {
      q: 'Why does item10 sort after item2 here but not elsewhere?',
      a: 'Sorting is natural: runs of digits compare as numbers. Plain lexicographic order compares character by character, which puts item10 before item2 because 1 precedes 2.',
    },
    {
      q: 'Does removing duplicates keep the first or the last?',
      a: 'The first occurrence stays and later repeats are dropped, so the original order of what remains is preserved.',
    },
  ],

  'regex-tester': [
    {
      q: 'Which regex flavour does this use?',
      a: 'JavaScript, the flavour your browser implements. Most patterns are portable, but lookbehind, named groups, and Unicode property escapes vary between languages — check before moving a pattern to Python or PCRE.',
    },
    {
      q: 'What do the g, i, and m flags do?',
      a: 'g finds every match instead of stopping at the first, i ignores case, and m makes ^ and $ match at line boundaries rather than only at the start and end of the whole string.',
    },
  ],

  'code-beautifier': [
    {
      q: 'Will this fix broken syntax?',
      a: 'No. It re-indents structure that is already valid. If the input has an unclosed bracket the output will look wrong, which is often a useful signal in itself.',
    },
  ],

  'xml-formatter': [
    {
      q: 'How do I spot an unclosed tag?',
      a: 'Watch the indentation. A tag that never closes keeps everything after it stepping further right, so the runaway nesting points straight at the problem.',
    },
  ],

  'html-encoder': [
    {
      q: 'Does escaping HTML make my site safe from XSS?',
      a: 'It is one necessary piece, not a complete defence. Escaping the five HTML characters protects text in element content and quoted attributes; URLs, inline scripts, and style contexts each need different handling.',
    },
  ],

  'word-counter': [
    {
      q: 'How are words counted?',
      a: 'By splitting on whitespace, which matches what word processors report. Hyphenated compounds count as one, and punctuation attached to a word does not add to the total.',
    },
    {
      q: 'What is a good length for a meta description?',
      a: 'Around 155 characters. Google truncates beyond roughly that width, so the tail of a longer one simply will not be shown in results.',
    },
  ],

  'case-converter': [
    {
      q: 'When should I use each casing style?',
      a: 'camelCase for JavaScript variables, PascalCase for classes and components, snake_case for Python and most SQL, kebab-case for URLs, CSS classes, and filenames.',
    },
  ],

  'slug-generator': [
    {
      q: 'What happens to accented characters?',
      a: 'They fold to their base letters: Café becomes cafe, Straße becomes strasse. Tools that simply strip non-ASCII would give you caf and strae instead, quietly mangling the word.',
    },
    {
      q: 'Should slugs contain stop words?',
      a: 'Usually not. Dropping the, a, and of keeps URLs short and readable without hurting how the page ranks, since the meaningful terms are still there.',
    },
  ],

  'markdown-editor': [
    {
      q: 'Which Markdown flavour is supported?',
      a: 'GitHub-flavoured Markdown, so tables, fenced code blocks, task lists, and strikethrough all render as you would expect on GitHub.',
    },
    {
      q: 'Is it safe to paste Markdown containing HTML?',
      a: 'Yes. Markdown permits raw HTML, so the rendered output is sanitised before it is displayed — a pasted script tag will not execute.',
    },
  ],

  'meta-tag-generator': [
    {
      q: 'How long should a title tag be?',
      a: 'About 60 characters. Past that Google cuts it off in results, so anything essential should sit near the front. The counter here turns red when you cross it.',
    },
    {
      q: 'What size should the Open Graph image be?',
      a: '1200 by 630 pixels. That is the ratio Facebook, LinkedIn, and Slack crop to, and smaller images may be ignored entirely rather than scaled up.',
    },
  ],

  'text-diff': [
    {
      q: 'Why do lines stay aligned when I add one at the top?',
      a: 'The comparison finds the longest common subsequence rather than comparing line 1 to line 1. Insert a line at the top and only that line is marked, instead of everything below shifting and reporting as changed.',
    },
  ],

  'plagiarism-checker': [
    {
      q: 'Does this search the web for copied text?',
      a: 'No. It compares the two passages you paste and nothing else, so it cannot tell you whether either was published elsewhere. It is for checking two drafts against each other.',
    },
    {
      q: 'Why does it match phrases rather than words?',
      a: 'Two honest articles on one topic share plenty of vocabulary. Sharing a run of five words in the same order is what actually signals copied text, so matching works on word sequences.',
    },
  ],

  'lorem-ipsum': [
    {
      q: 'Why use Latin placeholder text at all?',
      a: 'Because it has roughly the letter distribution of English without being readable, so nobody reviewing a mockup starts reading the copy instead of looking at the layout.',
    },
  ],

  'qr-code-generator': [
    {
      q: 'Do these QR codes expire?',
      a: 'No. The data is encoded directly into the pattern, so the code works forever and offline. Codes that expire are redirect services storing your link on their server.',
    },
    {
      q: 'How large should I print one?',
      a: 'A rough rule is one centimetre of code per ten centimetres of scanning distance. Download the largest size for anything printed — upscaling a small PNG blurs the edges and breaks scanning.',
    },
  ],

  'qr-code-decoder': [
    {
      q: 'Why will my image not decode?',
      a: 'Usually the code is too small in the frame, or the photo is at an angle. Crop tightly to the code and try again. Heavy compression and low contrast also defeat the detector.',
    },
    {
      q: 'Is it safe to open a link from a QR code?',
      a: 'Check it first. QR codes are a common way to disguise a destination because the URL is invisible until decoded, which is exactly what this tool shows you before you commit.',
    },
  ],

  'color-converter': [
    {
      q: 'When should I use HSL instead of HEX?',
      a: 'When you are building variations. HSL separates hue from saturation and lightness, so a hover state or a darker shade is one number away rather than a guess at new hex digits.',
    },
  ],

  'color-palette': [
    {
      q: 'Which scheme should I pick?',
      a: 'Analogous for calm, low-contrast interfaces. Complementary when an accent needs to stand out against the rest. Shades when you need a single-hue ramp for backgrounds, borders, and text.',
    },
  ],

  'image-compressor': [
    {
      q: 'Why did my PNG get bigger instead of smaller?',
      a: 'Almost always the wrong output format. JPEG handles photographs well and screenshots badly — flat colour and hard edges can come out larger than the source. WebP is the better default for graphics, and is what this tool now picks for PNG input.',
    },
    {
      q: 'Are my images uploaded to a server?',
      a: 'No. Re-encoding runs on a canvas in your browser, so the file never leaves your device. That also means very large images are limited by your own memory rather than an upload cap.',
    },
    {
      q: 'What quality setting should I use?',
      a: 'Around 75 percent is usually indistinguishable from the original for photographs while cutting the size substantially. Below about 50 you start to see blocking around edges.',
    },
  ],

  'json-to-csv': [
    {
      q: 'What happens to nested objects?',
      a: 'They flatten into dotted column names, so a role object with a title becomes a role.title column. Arrays of simple values join into one cell, since a spreadsheet row cannot hold a list.',
    },
    {
      q: 'Why are some values wrapped in quotes?',
      a: 'RFC 4180 requires quoting any field containing a delimiter, a quote, or a newline. Without it a value with a comma would split into two columns when opened in a spreadsheet.',
    },
  ],

  'csv-to-json': [
    {
      q: 'Does it handle commas inside quoted fields?',
      a: 'Yes. The parser reads character by character and tracks quoting, so an address field containing commas stays one value instead of splitting across columns.',
    },
    {
      q: 'Why did my ID with leading zeros become a string?',
      a: 'Deliberately. A value like 007 is almost always an identifier rather than the number seven, so leading zeros are preserved instead of being parsed away.',
    },
  ],

  'unit-converter': [
    {
      q: 'Are these US or imperial gallons?',
      a: 'US. A US gallon is about 3.785 litres against the imperial 4.546, so the two differ by roughly a fifth — enough to matter in a recipe or a fuel figure.',
    },
  ],

  'temperature-converter': [
    {
      q: 'Why can I not go below -273.15°C?',
      a: 'That is absolute zero, where a substance has no thermal energy left to remove. Nothing colder exists, so the tool flags it rather than showing a negative Kelvin value.',
    },
  ],

  'password-generator': [
    {
      q: 'Are these passwords actually random?',
      a: 'They come from the browser’s cryptographic random number generator, not Math.random(), which is seeded predictably and must never generate a password. Characters are drawn with rejection sampling so no part of the alphabet is favoured.',
    },
    {
      q: 'How long should a password be?',
      a: 'Long enough to clear about 80 bits of entropy, which the meter here shows as you adjust the length. With all four character sets that is roughly 13 characters; with lowercase only it takes about 18.',
    },
    {
      q: 'Is the generated password sent anywhere?',
      a: 'No. It is produced in your browser, never transmitted, and never stored — reloading the page loses it entirely.',
    },
  ],

  'random-generator': [
    {
      q: 'What is a version 4 UUID?',
      a: 'A 128-bit identifier that is almost entirely random, so two generated independently will not collide in any practical scenario. It is the usual choice for database keys and request IDs.',
    },
  ],
};

export const getFaqs = (toolId: string): Faq[] => TOOL_FAQS[toolId] ?? [];
