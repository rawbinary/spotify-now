import NextDocument, { Html, Head, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] font-sans text-white">
          <main className="flex min-h-screen flex-col items-center justify-center">
            <Main />
          </main>
          <NextScript />
        </body>
      </Html>
    );
  }
}
