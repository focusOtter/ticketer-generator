# Ticket Generator

## Introduction

Welcome to the Ticket Generator repository! This is a Node.js project that leverages the power of various libraries like `sharp` for image processing, `text-to-svg` for converting text to SVG format, and `bwip-js` for barcode generation, to create custom event tickets.

For a detailed overview and use-case scenario of this project, you can watch our [YouTube video](https://youtu.be/vpQi6Li_zuU?si=Aja5bsLOi5hhz0Xl) and read our blog post on [Focus Otter](https://blog.focusotter.com/generate-custom-event-tickets-in-nodejs).

## Features

- **Image Processing**: Using `sharp`, a high-performance Node.js image processing library.
- **SVG Text**: Convert text to SVG paths using `text-to-svg`.
- **Barcode Generation**: Create barcodes with `bwip-js` for a professional ticket look.
- **Customization**: Utilize design tools like Figma and Canva to create unique ticket templates.

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/focusOtter/ticketer-generator.git
   cd TicketGenerator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### Usage

To generate an event ticket, run:

```bash
node index.mjs
```

### Customization

- **Design Your Ticket**: Use tools like Figma or Canva to design your ticket template.
- **Find Coordinates**: Determine the X,Y coordinates on your template where the SVGs will be displayed.
- **Integrate with the Script**: Modify `index.mjs` to use your custom template and coordinates.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@focusotter](https://twitter.com/focusotter)
Project Link: [https://github.com/focusOtter/ticketer-generator](https://github.com/focusOtter/ticketer-generator)

---

This README is a brief overview of the `Ticket Generator` project. For any further details, please refer to the resources linked above. Enjoy creating your custom event tickets!
