import NextDocument, { Html, Head, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] font-sans text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
