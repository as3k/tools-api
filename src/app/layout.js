/* eslint-disable @next/next/no-page-custom-font */
import Layout from "../layouts/Default"
import "../styles/globals.css"

export const metadata = {
  title: "Tools API",
  description: "Utility endpoints and interfaces built with Next.js App Router",
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}

export default RootLayout
