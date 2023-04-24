import "./globals.css";
import { Inter } from "next/font/google";
import clsx from "clsx";
import App from "./App";

const inter = Inter({ subsets: ["latin"] });

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={clsx(
          inter.className,
          "bg-backdrop text-white container m-auto flex flex-col flex-grow min-h-screen max-w-5xl items-center px-4 lg:px-0"
        )}
      >
        <App>{children}</App>
      </body>
    </html>
  );
}
