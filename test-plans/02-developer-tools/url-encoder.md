# Test Plan: URL Encoder/Decoder

**Status:** ✅ Implemented  
**Category:** Developer Tools  
**Route:** `/tools/developer/url-encoder`  
**Last Updated:** 2026-08-15

---

## Overview

The URL Encoder allows users to encode URLs and special characters for safe URL usage, and decode encoded URLs back to readable form.

## Test Cases

### 1. Page Load & Layout

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.1 | Navigate to tool page | Page loads in < 2 seconds | ✅ PASS |
| 1.2 | Breadcrumbs display | "Home / Developer Tools / URL Encoder" shown | ✅ PASS |
| 1.3 | Title displays | "URL Encoder/Decoder" heading visible | ✅ PASS |
| 1.4 | No console errors | Loads without JavaScript errors | ✅ PASS |

**Test Date:** 2026-08-15 | **Tester:** Smoke Test

### 2. Encode Button

| # | Test Case | Input | Expected Output | Status |
|---|-----------|-------|-----------------|--------|
| 2.1 | Encode spaces | `hello world` | `hello%20world` | ✅ PASS |
| 2.2 | Encode special chars | `hello world & friends` | Spaces and & encoded correctly | ✅ PASS |
| 2.3 | Encode URL | `https://example.com/?q=test` | Properly encodes ? and = | ⚪ Not Yet Tested |
| 2.4 | Encode & character | `a&b` | `a%26b` | ✅ PASS |
| 2.5 | Encode = character | `a=b` | `a%3Db` | ⚪ Not Yet Tested |
| 2.6 | Encode / character | `path/to/file` | `path%2Fto%2Ffile` | ⚪ Not Yet Tested |
| 2.7 | Encode # character | `#anchor` | `%23anchor` | ⚪ Not Yet Tested |
| 2.8 | Encode empty input | Empty text | Shows error message | ⚪ Not Yet Tested |

### 3. Decode Button

| # | Test Case | Input | Expected Output | Status |
|---|-----------|-------|-----------------|--------|
| 3.1 | Decode encoded spaces | `hello%20world` | `hello world` | ⚪ Not Yet Tested |
| 3.2 | Decode @ symbol | `test%40example.com` | `test@example.com` | ⚪ Not Yet Tested |
| 3.3 | Decode full URL | Encoded URL | Readable URL | ⚪ Not Yet Tested |
| 3.4 | Decode & character | `a%26b` | `a&b` | ⚪ Not Yet Tested |
| 3.5 | Decode invalid input | Random %XX codes | Error or partial decode | ⚪ Not Yet Tested |
| 3.6 | Decode empty input | Empty text | Shows error message | ⚪ Not Yet Tested |

### 4. Copy Button

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 4.1 | Copy encoded output | Copies to clipboard | ⚪ Not Yet Tested |
| 4.2 | Copy decoded output | Copies to clipboard | ⚪ Not Yet Tested |

### 5. Clear Button

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 5.1 | Clear all fields | Input and output cleared | ⚪ Not Yet Tested |

### 6. Responsive Design

| # | Test Case | Viewport | Expected Result | Status |
|---|-----------|----------|-----------------|--------|
| 6.1 | Desktop | 1280x720 | Proper layout | ⚪ Not Yet Tested |
| 6.2 | Mobile | 375x812 | Readable stacked layout | ⚪ Not Yet Tested |

---

## Edge Cases

- [ ] Very long URLs (2000+ characters)
- [ ] URLs with query parameters
- [ ] URLs with fragments (#)
- [ ] International domain names (IDN)
- [ ] Rapidly switching between encode/decode

---

## Known Issues

- None currently

---

## Notes

- Test plan created, smoke testing pending
