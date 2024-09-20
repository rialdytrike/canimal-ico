import localFont from "next/font/local";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';

const bubbleGumSans = localFont({
  src: "./fonts/BubblegumSans.ttf",
  variable: "--bubblegum",
  weight: "100 900",
});

export const metadata = {
  title: "Canimal ICO Project",
  description: "an ICO for BSC testnet token",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${bubbleGumSans.variable} antialiased  `}
      >
           <Providers>{children}</Providers>
      </body>
    </html>
  );
}
