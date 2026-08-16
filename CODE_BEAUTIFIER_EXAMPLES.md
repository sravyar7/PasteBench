# Code Beautifier - Test Samples & Examples

**Tool Location:** `/tools/developer/code-beautifier`  
**Status:** ✅ Tested & Working  
**Supported Formats:** JavaScript, JSON, HTML, XML

---

## Overview

The Code Beautifier formats and beautifies code in multiple languages with proper indentation. It supports:
- JavaScript (ES6+)
- JSON
- HTML
- XML

**Features:**
- Multiple language support
- Adjustable indent sizes (2, 4, 8 spaces)
- Copy button for quick copying
- Real-time formatting

---

## Example 1: JavaScript

### Input (Minified)
```javascript
const greeting="Hello";const sayHi=()=>{console.log(greeting);const arr=[1,2,3];arr.forEach((item)=>{console.log(item);});};sayHi();
```

### Output (Beautified - 2 spaces)
```javascript
const greeting = "Hello";
const sayHi = () => {
  console.log(greeting);
  const arr = [
    1,
    2,
    3
  ];
  arr.forEach((item) => {
    console.log(item);
  });
};
sayHi();
```

**What Changed:**
- Added proper indentation (2 spaces)
- Added spacing around operators (`=`)
- Split long lines into multiple lines
- Proper closing braces alignment

**Use Cases:**
- Beautify minified JavaScript
- Readable code for debugging
- Prepare code for documentation
- Format copied code snippets

---

## Example 2: JSON

### Input (Minified)
```json
{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"Boston","state":"MA","zip":"02101"},"hobbies":["reading","coding","gaming"]}
```

### Output (Beautified - 2 spaces)
```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "state": "MA",
    "zip": "02101"
  },
  "hobbies": [
    "reading",
    "coding",
    "gaming"
  ]
}
```

**What Changed:**
- Proper line breaks for readability
- Consistent indentation for nested objects
- Clear structure of arrays
- Spacing after colons

**Use Cases:**
- Format API responses
- Make JSON configs readable
- Debug JSON structures
- Prepare data for sharing

---

## Example 3: HTML

### Input (Minified)
```html
<!DOCTYPE html><html><head><title>Sample Page</title></head><body><div class="container"><h1>Hello World</h1><p>This is a sample HTML page.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div></body></html>
```

### Output (Beautified - 2 spaces)
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Sample Page</title>
  </head>
  <body>
    <div class="container">
      <h1>Hello World</h1>
      <p>This is a sample HTML page.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  </body>
</html>
```

**What Changed:**
- Each tag on new line
- Proper nesting indentation
- Clear structure hierarchy
- Readable parent-child relationships

**Use Cases:**
- Format copied HTML code
- Make HTML templates readable
- Debug complex HTML structures
- Prepare HTML for code review

---

## Example 4: XML

### Input (Minified)
```xml
<?xml version="1.0" encoding="UTF-8"?><root><person><name>John Doe</name><age>30</age><email>john@example.com</email><address><street>123 Main St</street><city>Boston</city><state>MA</state><zip>02101</zip></address></person></root>
```

### Output (Beautified - 2 spaces)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <person>
    <name>John Doe</name>
    <age>30</age>
    <email>john@example.com</email>
    <address>
      <street>123 Main St</street>
      <city>Boston</city>
      <state>MA</state>
      <zip>02101</zip>
    </address>
  </person>
</root>
```

**What Changed:**
- XML declaration on separate line
- Proper nesting indentation
- Clear element hierarchy
- Readable structure

**Use Cases:**
- Format SOAP/XML API responses
- Make XML configs readable
- Debug XML data structures
- Prepare XML for validation

---

## Indent Size Comparison

### Same JSON with Different Indents

**2 spaces (Default):**
```json
{
  "name": "John",
  "address": {
    "city": "Boston"
  }
}
```

**4 spaces:**
```json
{
    "name": "John",
    "address": {
        "city": "Boston"
    }
}
```

**8 spaces:**
```json
{
        "name": "John",
        "address": {
                "city": "Boston"
        }
}
```

---

## Real-World Examples

### API Response (JSON)
**Before (Minified Response):**
```json
{"status":"success","data":{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]},"timestamp":1692038400}
```

**After (Beautified):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Alice"
      },
      {
        "id": 2,
        "name": "Bob"
      }
    ]
  },
  "timestamp": 1692038400
}
```

---

### React Component (JavaScript)
**Before (Minified):**
```javascript
const App=()=>{const[count,setCount]=React.useState(0);return React.createElement("div",null,React.createElement("h1",null,"Counter"),React.createElement("p",null,"Count: ",count),React.createElement("button",{onClick:()=>setCount(count+1)},"Increment"))};
```

**After (Beautified):**
```javascript
const App = () => {
  const [count, setCount] = React.useState(0);
  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Counter"),
    React.createElement("p", null, "Count: ", count),
    React.createElement(
      "button",
      {
        onClick: () => setCount(count + 1)
      },
      "Increment"
    )
  );
};
```

---

### HTML Template (HTML)
**Before (Minified):**
```html
<form><div><label for="name">Name:</label><input type="text" id="name" required></div><div><label for="email">Email:</label><input type="email" id="email" required></div><button type="submit">Submit</button></form>
```

**After (Beautified):**
```html
<form>
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" required>
  </div>
  <div>
    <label for="email">Email:</label>
    <input type="email" id="email" required>
  </div>
  <button type="submit">Submit</button>
</form>
```

---

## Feature Verification ✅

| Feature | Status | Notes |
|---------|--------|-------|
| JavaScript Beautify | ✅ PASS | Tested with arrow functions and array |
| JSON Beautify | ✅ PASS | Tested with nested objects |
| HTML Beautify | ✅ PASS | Tested with DOCTYPE and nested divs |
| XML Beautify | ✅ PASS | Tested with XML declaration |
| 2-Space Indent | ✅ PASS | Default and working |
| 4-Space Indent | ✅ PASS | Available option |
| 8-Space Indent | ✅ PASS | Available option |
| Copy Button | ✅ PASS | Works with beautified output |
| Clear Button | ✅ PASS | Resets input/output |

---

## Tips for Using Code Beautifier

1. **Paste Minified Code:** Copy any minified code and paste it in
2. **Select Language:** Choose the correct language from dropdown
3. **Adjust Indent:** Pick your preferred indent size (2, 4, or 8 spaces)
4. **Click Beautify:** Format the code
5. **Copy Output:** Click Copy to quickly copy the beautified code

---

## Common Use Cases

✅ **Debugging:** Make minified code readable for debugging  
✅ **Documentation:** Prepare clean code samples for docs  
✅ **Code Review:** Format code before sending for review  
✅ **Learning:** Understand structure of copied code snippets  
✅ **Migration:** Convert between indent styles  
✅ **Sharing:** Share readable code with teammates  
✅ **Storage:** Convert minified to readable for archiving

---

## Edge Cases Supported

- ✅ Nested objects (JSON)
- ✅ Arrays (JSON)
- ✅ Arrow functions (JavaScript)
- ✅ Template literals (JavaScript)
- ✅ Complex HTML structures
- ✅ XML with attributes
- ✅ XML declarations
- ✅ Multiple levels of nesting

---

## Limitations & Notes

- Works best with valid/well-formed code
- Malformed code may not beautify correctly
- Comments are preserved in JavaScript
- Special characters must be valid for each language

---

## Next Steps

Try these examples yourself:

1. Copy JavaScript example
2. Paste into Code Beautifier
3. Change language to JSON
4. Try 4-space indent
5. Test with your own code!

**Status:** Code Beautifier fully functional and tested for all formats! 🎉
