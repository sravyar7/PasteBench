# URL Encoder/Decoder - Examples & Use Cases

**Tool Location:** `/tools/developer/url-encoder`  
**Description:** Encode text to URL-safe format or decode URL-encoded strings

---

## What Does It Do?

The URL Encoder converts special characters in text/URLs into a format that is safe to use in web URLs. This is useful when you need to pass text as URL parameters, create shareable links, or send data through query strings.

**Key Feature:** The tool has an "Auto Detect" button that automatically detects if text is already encoded and decides whether to encode or decode.

---

## Example 1: Simple Text with Spaces

### Input (Plain Text)
```
hello world
```

### Output (Encoded)
```
hello%20world
```

**What Changed:**
- Space character → `%20`

**Use Case:** When you need to include spaces in a URL parameter

**Real URL Example:**
```
https://example.com/search?q=hello%20world
```

---

## Example 2: Special Characters in Email

### Input (Plain Text)
```
user@example.com
```

### Output (Encoded)
```
user%40example.com
```

**What Changed:**
- `@` symbol → `%40`

**Use Case:** Passing email addresses as URL parameters

**Real URL Example:**
```
https://example.com/notify?email=user%40example.com
```

---

## Example 3: URL with Query Parameters

### Input (Plain Text)
```
https://example.com/search?q=hello world&page=2
```

### Output (Encoded)
```
https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26page%3D2
```

**What Changed:**
- `:` (colon) → `%3A`
- `/` (forward slash) → `%2F`
- `?` (question mark) → `%3F`
- `=` (equals) → `%3D`
- `&` (ampersand) → `%26`
- Space → `%20`

**Use Case:** Encoding entire URLs to embed them in other URLs or API calls

**Real URL Example:** Passing a redirect URL
```
https://api.example.com/redirect?url=https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26page%3D2
```

---

## Example 4: Social Media Share Text

### Input (Plain Text)
```
Check out this tool: JSON Formatter & Validator (100% Free!)
```

### Output (Encoded)
```
Check%20out%20this%20tool%3A%20JSON%20Formatter%20%26%20Validator%20%28100%25%20Free%21%29
```

**What Changed:**
- Spaces → `%20`
- `:` (colon) → `%3A`
- `&` (ampersand) → `%26`
- `(` (parenthesis) → `%28`
- `)` (parenthesis) → `%29`
- `%` (percent) → `%25`
- `!` (exclamation) → `%21`

**Use Case:** Creating shareable social media links with encoded text

**Real URL Example:** Twitter share link
```
https://twitter.com/intent/tweet?text=Check%20out%20this%20tool%3A%20JSON%20Formatter%20%26%20Validator%20%28100%25%20Free%21%29
```

---

## Example 5: Decode Back to Original

### Input (Encoded Text)
```
hello%20world%26friends
```

### Output (Decoded)
```
hello world & friends
```

**What Changed:**
- `%20` → Space
- `%26` → `&` (ampersand)

**Use Case:** When you receive a URL parameter and need to read the original text

---

## Common Special Characters Reference

| Character | Encoded | Use In |
|-----------|---------|--------|
| Space | `%20` | Query parameters, search terms |
| `@` | `%40` | Email addresses |
| `#` | `%23` | Hashtags, anchors |
| `&` | `%26` | URL parameter separator |
| `=` | `%3D` | Query parameter assignment |
| `?` | `%3F` | Query string start |
| `/` | `%2F` | Path separators |
| `:` | `%3A` | Protocol separators |
| `%` | `%25` | Literal percent sign |
| `!` | `%21` | Exclamation marks |
| `(` | `%28` | Opening parenthesis |
| `)` | `%29` | Closing parenthesis |
| `[` | `%5B` | Opening bracket |
| `]` | `%5D` | Closing bracket |
| `+` | `%2B` | Plus sign |
| `,` | `%2C` | Comma |
| `;` | `%3B` | Semicolon |
| `'` | `%27` | Single quote |
| `"` | `%22` | Double quote |

---

## Real-World Use Cases

### 1. Search Query
**Scenario:** User searches for "best tools for developers"

**Without Encoding (Broken):**
```
https://example.com/search?q=best tools for developers
```
❌ Spaces break the URL

**With Encoding (Works):**
```
https://example.com/search?q=best%20tools%20for%20developers
```
✅ URL works correctly

---

### 2. Redirect Link
**Scenario:** Shortening service redirects to another URL

**Original URL (Long):**
```
https://documentation.example.com/api/guide?section=installation&version=2.0
```

**Shortened Redirect (Encoded):**
```
https://short.url/r?target=https%3A%2F%2Fdocumentation.example.com%2Fapi%2Fguide%3Fsection%3Dinstallation%26version%3D2.0
```

---

### 3. Email Verification Link
**Scenario:** Sending verification email with user address

**Original Email:**
```
user+test@example.com
```

**In Verification Link (Encoded):**
```
https://example.com/verify?email=user%2Btest%40example.com&token=abc123
```
- `+` → `%2B`
- `@` → `%40`

---

### 4. Social Media Share
**Scenario:** Creating a share link for Twitter/Facebook

**Share Title:**
```
Introducing OnlineTools: 25+ Free Tools for Developers & Creators
```

**Encoded for Twitter:**
```
https://twitter.com/intent/tweet?text=Introducing%20OnlineTools%3A%2025%2B%20Free%20Tools%20for%20Developers%20%26%20Creators&url=https%3A%2F%2Fonlinetools.example.com
```

---

### 5. API Request Parameter
**Scenario:** Sending user input to an API

**User Input:**
```
Find documents with status="completed" and owner=john@example.com
```

**API Call (Encoded):**
```
https://api.example.com/search?query=Find%20documents%20with%20status%3D%22completed%22%20and%20owner%3Djohn%40example.com
```

---

## When to Use Each Button

### Encode Button
**Use When:** You have plain text and need URL-safe format
- Plain text with spaces
- Special characters in data
- Creating query parameters
- Building shareable links

### Decode Button
**Use When:** You have URL-encoded text and need to read the original
- Received an encoded URL parameter
- Debugging API responses
- Understanding shortened URLs

### Auto Detect Button
**Use When:** You're not sure if text is already encoded
- Received data from external source
- Want automatic detection
- Building automation scripts

### Clear Button
**Use When:** You want to reset and start over
- Clear both input and output
- Start a new encoding/decoding task

---

## Tool Features Verified

✅ **Encoding Works:** Converts special characters to %XX format  
✅ **Decoding Works:** Converts %XX back to original characters  
✅ **Copy Button:** Quickly copy output to clipboard  
✅ **Auto Detect:** Automatically detects and converts  
✅ **Mobile Responsive:** Works on phones and tablets  
✅ **100% Client-Side:** No data sent to servers  

---

## Tips for Using URL Encoder

1. **Test with Simple Text First:** Start with "hello world" to see how spaces work
2. **Use Auto Detect for Unknown Text:** If unsure if text is encoded, use Auto Detect
3. **Copy Immediately:** Use Copy button to avoid manual typing errors
4. **Verify in Real URL:** Test encoded URLs in browser address bar to confirm they work
5. **Check Special Characters:** Reference the table above for common encoding patterns

---

## FAQ

**Q: Why encode URLs at all?**  
A: URLs can only contain certain characters. Special characters must be encoded so they don't break the URL or get misinterpreted by servers.

**Q: Is my data safe?**  
A: Yes! OnlineTools is 100% client-side. Your data never leaves your browser.

**Q: Can I decode someone else's URL?**  
A: Yes! Paste the URL in and click Decode to see what parameters they're using.

**Q: What's the difference between %20 and +?**  
A: Both represent spaces in URLs, but %20 is more universal. This tool uses %20.

**Q: Do I need to encode the entire URL?**  
A: Usually only the parameter values need encoding, not the full URL structure.

---

## Next Steps

Try these examples yourself in the tool:

1. `Hello World` → Click Encode → See `Hello%20World`
2. `user@example.com` → Click Encode → See `user%40example.com`
3. `https%3A%2F%2Fexample.com` → Click Decode → See `https://example.com`
4. Paste any text → Click Auto Detect → Let the tool decide

**Happy encoding! 🔗**
