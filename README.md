# MesoStem Articles' Designing Tool

A dedicated internal tool for the **MesoStem team** that helps create beautifully formatted article pages from structured text.

The tool supports English and Arabic content, automatic text layout, multiple pages, custom fonts, formatting, and downloadable PNG outputs.

> **This tool is intended exclusively for the MesoStem team.**

---

## Features

- 🇬🇧 **English support (LTR)**
- 🇮🇶 **Arabic support (RTL)**
- Custom fonts for Arabic and English
- Automatic text wrapping
- Automatic multi-page generation
- Adjustable text box position and size
- Drag-and-resize text area directly on the canvas
- Custom text alignment
- Text justification
- Custom text sizes
- Custom colors
- Adjustable line spacing
- Adjustable heading spacing
- Background image support
- Bold text formatting
- Large heading formatting
- Small text formatting
- Download generated pages as PNG images
- Responsive layout for desktop and mobile devices

---

## Formatting Syntax

The script editor supports simple formatting markers.

### Big Text / Headings

Wrap text with `++`:

```text
++This is a heading++
```

### Bold Text

Wrap text with `**`:

```text
This is **bold text**.
```

### Small Text

Wrap text with `~~`:

```text
This is ~~small text~~.
```

### Paragraphs

Separate paragraphs using an empty line:

```text
This is the first paragraph.

This is the second paragraph.
```

---

## Project Structure

```text
project/
│
├── index.html
├── style.css
├── script.js
│
├── background.png
├── mesostem-logo.png
│
└── fonts/
    ├── ArFontBig.ttf
    ├── ArFontSmall.otf
    ├── EnFontBig.otf
    └── EnFontSmall.otf
```

---

## Installation

No installation or external dependencies are required.

Simply keep the project files together and open:

```text
index.html
```

in a modern web browser.

For the best experience, it is recommended to run the project using a local development server.

For example, with VS Code and the **Live Server** extension.

---

## Required Files

The project expects the following assets:

### Background

```text
background.png
```

This image is used as the background for every generated article page.

### Logo

```text
mesostem-logo.png
```

This logo appears in the application's header.

### Fonts

The project uses separate fonts for Arabic and English:

```text
fonts/ArFontBig.otf
fonts/ArFontSmall.otf

fonts/EnFontBig.otf
fonts/EnFontSmall.otf
```

TTF versions can also be provided as fallbacks.

---

## How to Use

1. Open the tool in your browser.
2. Choose the language:
   - English (LTR)
   - Arabic (RTL)

3. Adjust the text box position and size if necessary.
4. Configure text sizes, colors, and spacing.
5. Write or paste your article into the script editor.
6. Use formatting markers such as `++`, `**`, and `~~`.
7. Click **Generate Pages**.
8. Review the generated pages.
9. Download each page as a PNG image.

---

## Text Box Controls

The text box can be adjusted in two ways:

### Manual Input

Change the following values:

- X position
- Y position
- Width
- Height

### Canvas Controls

You can also interact directly with the canvas:

- Drag the dashed box to move it.
- Drag the corners to resize it.

---

## Languages

### English

English uses a left-to-right layout by default.

### Arabic

Arabic automatically supports:

- Right-to-left direction
- Right alignment
- Text justification

You can still manually change alignment settings when needed.

---

## License

**Copyright © MesoStem. All Rights Reserved.**

This project and its source code are intended exclusively for authorized use by the MesoStem team.

No part of this project may be used, copied, modified, distributed, published, or incorporated into another project without explicit permission from the copyright holder.

If you would like to use any part of this code, please contact the project owner and request permission first.

Unauthorized use is prohibited.

---

## Internal Use

This tool was created as a dedicated tool for the **MesoStem team**.

It is designed specifically to support the team's article creation and visual content workflow.

**Built for MesoStem.**
