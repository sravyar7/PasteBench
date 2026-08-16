# Test Plan: JSON Formatter & Validator

**Status:** ✅ Implemented  
**Category:** Developer Tools  
**Route:** `/tools/developer/json-formatter`  
**Last Updated:** 2026-08-15

---

## Overview

The JSON Formatter allows users to format, minify, and validate JSON with custom indentation. All processing is client-side with no server uploads.

## Test Cases

### 1. Page Load & Layout

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.1 | Navigate to tool page | Page loads in < 2 seconds | ✅ PASS |
| 1.2 | Breadcrumbs display | "Home / Developer Tools / JSON Formatter" shown | ✅ PASS |
| 1.3 | Title displays | "JSON Formatter & Validator" heading visible | ✅ PASS |
| 1.4 | Description visible | "Format, validate, and minify JSON instantly..." text present | ✅ PASS |
| 1.5 | Input/Output layout | Two-column layout on desktop, stacked on mobile | ✅ PASS |
| 1.6 | No console errors | Page loads without JavaScript errors | ✅ PASS |

**Test Date:** 2026-08-15 | **Tester:** Smoke Test

### 2. Format Button (Primary Feature)

| # | Test Case | Input | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.1 | Format valid JSON | `{"name":"John","age":30}` | Formatted with 2-space indent | ✅ PASS |
| 2.2 | Format nested JSON | Complex nested object | Proper indentation at all levels | ⚪ Not Yet Tested |
| 2.3 | Format with arrays | `{"items":[1,2,3]}` | Arrays properly indented | ⚪ Not Yet Tested |
| 2.4 | Empty input error | Empty text area | Shows "Please enter JSON to format" error | ⚪ Not Yet Tested |
| 2.5 | Invalid JSON error | `{"name":"John",}` (trailing comma) | Shows specific error at Line 1, Column 27 | ✅ PASS |
| 2.6 | Unmatched brackets | `{"name":"John"` (missing `}`) | Shows error "Unexpected end of JSON" | ⚪ Not Yet Tested |
| 2.7 | Unclosed string | `{"name":"John}` | Shows error about unclosed quote | ⚪ Not Yet Tested |

### 3. Minify Button

| # | Test Case | Input | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.1 | Minify valid JSON | Formatted JSON | Single line output | ⚪ Not Yet Tested |
| 3.2 | Minify removes whitespace | Multi-line JSON | All whitespace removed | ⚪ Not Yet Tested |
| 3.3 | Minify empty input | Empty text area | Shows error message | ⚪ Not Yet Tested |
| 3.4 | Minify invalid JSON | `{"invalid"}` | Shows error message | ⚪ Not Yet Tested |

### 4. Validate Button

| # | Test Case | Input | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.1 | Validate valid JSON | `{"name":"John"}` | Shows "✓ Valid JSON" with green background | ⚪ Not Yet Tested |
| 4.2 | Validate invalid JSON | `{"name":"John",}` | Shows error message in red | ⚪ Not Yet Tested |
| 4.3 | Validate empty input | Empty text area | Shows error message | ⚪ Not Yet Tested |
| 4.4 | Success indicator | Valid JSON | Clear visual feedback (green color, checkmark) | ⚪ Not Yet Tested |

### 5. Load Sample Button

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 5.1 | Click "Load Sample" | Sample JSON appears in input area | ⚪ Not Yet Tested |
| 5.2 | Sample content | Shows realistic example with name, age, email, skills | ⚪ Not Yet Tested |
| 5.3 | Replace existing input | Overwrites any text already in input | ⚪ Not Yet Tested |

### 6. Copy Button

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 6.1 | Copy visible only with output | Hidden when output is empty | ⚪ Not Yet Tested |
| 6.2 | Copy to clipboard | Clicking copies formatted JSON | ⚪ Not Yet Tested |
| 6.3 | Copy format preserved | Copied text includes indentation | ⚪ Not Yet Tested |

### 7. Clear Button

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 7.1 | Clear input | Input textarea becomes empty | ⚪ Not Yet Tested |
| 7.2 | Clear output | Output area clears | ⚪ Not Yet Tested |
| 7.3 | Clear errors | Error messages disappear | ⚪ Not Yet Tested |
| 7.4 | Clear all fields | Complete reset of tool state | ⚪ Not Yet Tested |

### 8. Indent Size Selector

| # | Test Case | Indent Value | Expected Result | Status |
|---|-----------|--------------|-----------------|--------|
| 8.1 | Format with 2 spaces | 2 | Output uses 2-space indentation | ✅ PASS |
| 8.2 | Format with 4 spaces | 4 | Output uses 4-space indentation | ⚪ Not Yet Tested |
| 8.3 | Format with 8 spaces | 8 | Output uses 8-space indentation | ⚪ Not Yet Tested |
| 8.4 | Format with 1 space (Tab) | 1 | Output uses single space | ⚪ Not Yet Tested |
| 8.5 | Change indent mid-session | Change from 2 to 4 | Format button uses new indentation | ⚪ Not Yet Tested |

### 9. Error Messages (Detailed Testing)

| # | Error Type | Input | Expected Message | Status |
|---|-----------|-------|-------------------|--------|
| 9.1 | Trailing comma | `{"a":1,}` | Error with line/column info | ✅ PASS |
| 9.2 | Missing closing brace | `{"a":1` | Indicates incomplete JSON | ⚪ Not Yet Tested |
| 9.3 | Invalid quotes | `{"a': "value"}` | Quote error with location | ⚪ Not Yet Tested |
| 9.4 | Missing colon | `{"a" "b"}` | Error for missing separator | ⚪ Not Yet Tested |
| 9.5 | Extra comma | `{"a":1, , "b":2}` | Error for unexpected comma | ⚪ Not Yet Tested |

### 10. Features Display

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 10.1 | "✨ Format" feature | Description displays | ⚪ Not Yet Tested |
| 10.2 | "🔍 Validate" feature | Description displays | ⚪ Not Yet Tested |
| 10.3 | "📦 Minify" feature | Description displays | ⚪ Not Yet Tested |
| 10.4 | Feature icons visible | All emojis/icons render | ⚪ Not Yet Tested |

### 11. Responsive Design

| # | Test Case | Viewport | Expected Result | Status |
|---|-----------|----------|-----------------|--------|
| 11.1 | Desktop layout | 1280x720 | 2-column layout with proper spacing | ⚪ Not Yet Tested |
| 11.2 | Mobile layout | 375x812 | Stacked single-column layout | ✅ PASS |
| 11.3 | Tablet layout | 768x1024 | Proper responsive breakpoint | ⚪ Not Yet Tested |
| 11.4 | Input height mobile | 375x812 | Input textbox remains usable size | ✅ PASS |
| 11.5 | Output height mobile | 375x812 | Output area scrollable if needed | ✅ PASS |

### 12. Accessibility

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 12.1 | Textareas have labels | "Input JSON" and "Output JSON" labels visible | ⚪ Not Yet Tested |
| 12.2 | Buttons are keyboard accessible | Tab navigation works through all buttons | ⚪ Not Yet Tested |
| 12.3 | Focus states visible | Focused elements have visible outline | ⚪ Not Yet Tested |
| 12.4 | Error text is semantic | Errors don't rely on color alone | ⚪ Not Yet Tested |

---

## Edge Cases & Stress Tests

- [ ] Very large JSON (1MB+) - Performance test
- [ ] Deeply nested JSON (100+ levels) - Rendering test
- [ ] JSON with unicode characters
- [ ] JSON with special escape sequences (\n, \t, \\")
- [ ] Rapid button clicks (Format, Minify, Validate in quick succession)
- [ ] Paste extremely long text at once
- [ ] Copy button when output is very large

---

## Test Data

### Valid JSON Examples
```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "skills": ["JavaScript", "React", "TypeScript"]
}
```

### Invalid JSON Examples
- Trailing comma: `{"a":1,}`
- Missing closing brace: `{"a":1`
- Mismatched quotes: `{"a': "b"}`
- Extra comma: `{"a":1, , "b":2}`

---

## Known Issues

- None currently

---

## Notes

- **Smoke Test Status:** PASS - Format button works, error handling works, responsive design verified
- **Next:** Run comprehensive test suite for all buttons and edge cases
- **Next:** Test all error message scenarios
- **Next:** Verify keyboard navigation and accessibility
