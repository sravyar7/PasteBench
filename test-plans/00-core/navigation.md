# Test Plan: Navigation & Header

**Status:** 🟡 In Progress  
**Category:** Core / Navigation  
**Last Updated:** 2026-08-15

---

## Overview

Navigation encompasses the header, links between pages, breadcrumbs, and overall site flow.

## Test Cases

### 1. Header & Logo

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.1 | Logo visible | OnlineTools logo/text displays | ✅ PASS |
| 1.2 | Logo links home | Clicking logo navigates to `/` | ⚪ Not Yet Tested |
| 1.3 | Header styled | Proper background and spacing | ⚪ Not Yet Tested |
| 1.4 | Header sticky | Header visible when scrolling (if applicable) | ⚪ Not Yet Tested |

### 2. Navigation Links

| # | Test Case | Link | Destination | Status |
|---|-----------|------|-------------|--------|
| 2.1 | Home link | "Home" | `/` (homepage) | ⚪ Not Yet Tested |
| 2.2 | Developer link | "Developer" | `/?category=developer` | ⚪ Not Yet Tested |
| 2.3 | Content link | "Content" | `/?category=content` | ⚪ Not Yet Tested |
| 2.4 | Image link | "Image" | `/?category=image` | ⚪ Not Yet Tested |
| 2.5 | Converter link | "Converter" | `/?category=converter` | ⚪ Not Yet Tested |

### 3. Mobile Navigation

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 3.1 | Desktop nav visible | Navigation shows on desktop (1280+) | ⚪ Not Yet Tested |
| 3.2 | Mobile nav text | Mobile shows "Tools" or menu button | ⚪ Not Yet Tested |
| 3.3 | Mobile menu accessible | Menu is tappable on mobile | ⚪ Not Yet Tested |

### 4. Breadcrumbs

| # | Test Case | Page | Expected Breadcrumbs | Status |
|---|-----------|------|---------------------|--------|
| 4.1 | Homepage | `/` | No breadcrumbs (or "Home") | ⚪ Not Yet Tested |
| 4.2 | Tool page | `/tools/developer/json-formatter` | "Home / Developer Tools / JSON Formatter" | ✅ PASS |
| 4.3 | Breadcrumb links | Any tool page | Home link navigates back | ⚪ Not Yet Tested |

### 5. Back Navigation

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 5.1 | Browser back button | Returns to previous page | ⚪ Not Yet Tested |
| 5.2 | Breadcrumb home click | Navigates to homepage | ⚪ Not Yet Tested |

### 6. Active States

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 6.1 | Current page link | Highlighted/active state visible | ⚪ Not Yet Tested |
| 6.2 | Hover states | Links show hover effect | ⚪ Not Yet Tested |

---

## Notes

- Smoke test verified breadcrumbs and homepage navigation working
- Next: Test all category links
- Next: Test mobile navigation behavior
