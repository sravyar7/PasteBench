# Smoke Test Checklist - OnlineTools

**Quick reference for rapid smoke testing before releases**

Run this checklist to verify the application works end-to-end. Estimated time: 10-15 minutes.

---

## Pre-Test Setup

- [ ] Dev server running (`npm run dev`)
- [ ] No console errors before starting
- [ ] Browser cache cleared (or incognito mode)
- [ ] Test on both desktop and mobile viewports

---

## 1. Homepage (Critical Path)

**Desktop View (1280x800)**
- [ ] Homepage loads without errors
- [ ] Hero section displays with gradient text "Free Online Tools for Everyone"
- [ ] Search bar is visible and responsive
- [ ] All 5 category buttons display: All Tools, Developer, Content, Image, Converter
- [ ] Tool grid shows at least 3 tools visible
- [ ] Trust signals section displays (100% Free, Private, Instant)
- [ ] No broken images or missing text
- [ ] No horizontal scrolling

**Mobile View (375x812)**
- [ ] Homepage is readable on mobile
- [ ] Search bar is accessible
- [ ] Category buttons are visible (may be stacked)
- [ ] Tool grid is single column
- [ ] No horizontal scrolling
- [ ] Tap targets are at least 44px (touch-friendly)

---

## 2. Navigation

- [ ] Logo/Home link navigates to homepage
- [ ] "Home" link works
- [ ] "Developer" category link filters correctly
- [ ] "Content" category link filters correctly
- [ ] "Image" category link filters correctly
- [ ] "Converter" category link filters correctly
- [ ] Tool cards are clickable and navigate to tool page
- [ ] Back button/navigation works

---

## 3. Search & Filtering

- [ ] Searching "json" shows only JSON-related tools
- [ ] Searching "base64" shows only Base64 tools
- [ ] Searching with no matches shows "No tools found" message
- [ ] Clicking "Developer" filter shows only developer tools
- [ ] Clicking "All Tools" clears category filter
- [ ] Combining search + filter works together
- [ ] Clear search input clears results filter

---

## 4. Implemented Tools

### JSON Formatter
**Location:** `/tools/developer/json-formatter`
- [ ] Page loads without errors
- [ ] Breadcrumbs show "Home / Developer Tools / JSON Formatter"
- [ ] **Format button:** Formats valid JSON correctly
- [ ] **Minify button:** Minifies JSON to single line
- [ ] **Validate button:** Shows "✓ Valid JSON" for valid input
- [ ] **Error display:** Shows helpful error for invalid JSON (with line/column)
- [ ] **Load Sample:** Loads example JSON
- [ ] **Copy button:** Works when output exists
- [ ] **Clear button:** Clears all fields
- [ ] **Indent selector:** Changes work (2, 4, 8 spaces)
- [ ] Handles edge cases: empty input, trailing commas, unmatched brackets

### Base64 Encoder
**Location:** `/tools/developer/base64-encoder`
- [ ] Page loads without errors
- [ ] Breadcrumbs display correctly
- [ ] **Encode button:** Encodes text to Base64
- [ ] **Decode button:** Decodes Base64 to text
- [ ] **Copy button:** Works
- [ ] **Clear button:** Clears fields
- [ ] Handles empty input gracefully

### URL Encoder
**Location:** `/tools/developer/url-encoder`
- [ ] Page loads without errors
- [ ] Breadcrumbs display correctly
- [ ] **Encode button:** Encodes special characters
- [ ] **Decode button:** Decodes URL encoding
- [ ] **Copy button:** Works
- [ ] **Clear button:** Clears fields
- [ ] Handles spaces, /, ?, &, = correctly

---

## 5. UI/UX

### Colors & Contrast
- [ ] Text is readable on light background
- [ ] Text is readable on dark background (if dark mode exists)
- [ ] Buttons are clearly visible
- [ ] Links are clearly identifiable

### Responsive Design
- [ ] Text doesn't overflow on any screen size
- [ ] Buttons don't overlap
- [ ] Forms are usable on mobile
- [ ] Ad containers scale properly

### Interactions
- [ ] Hover states work on desktop
- [ ] Buttons have visual feedback when clicked
- [ ] Focus states are visible (for keyboard navigation)
- [ ] Transitions are smooth (not jarring)

---

## 6. Technical

### Console & Errors
- [ ] No JavaScript errors in console
- [ ] No TypeScript type errors
- [ ] No 404 errors for assets
- [ ] No network request failures (except ads)

### Performance
- [ ] Homepage loads in < 3 seconds
- [ ] Tool pages load in < 2 seconds
- [ ] Click to response is immediate (< 100ms)

### Build
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes (or runs with no errors)

---

## 7. Ad Integration

- [ ] Ad containers render (or show placeholder)
- [ ] Missing ads don't break layout
- [ ] Ads don't cause console errors

---

## Results

**Date Tested:** ________________  
**Tester:** ________________  
**Browser:** ________________  
**Viewport:** ________________  

**Overall Status:** 
- [ ] PASS - All tests passed
- [ ] FAIL - Issues found (see notes below)
- [ ] PARTIAL - Some features working

**Issues Found:**
```
1. 
2. 
3. 
```

**Notes:**
```


```

---

**How to Use:**
1. Print or copy this checklist
2. Run through each section sequentially
3. Check off passing tests
4. Document any failures
5. Include screenshots of failures
6. File issues for any bugs found
