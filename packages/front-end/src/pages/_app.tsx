import { useEffect, useState } from "react";
import Script from "next/script";
import "../styles/globals.css";

export default function App({ Component, pageProps }: any) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;

    const initial =
      saved ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(initial);

    document.documentElement.classList.toggle(
      "dark",
      initial === "dark"
    );
  }, []);

  const toggleTheme = () => {
    const newTheme =
      theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    localStorage.setItem(
      "theme",
      newTheme
    );

    document.documentElement.classList.toggle(
      "dark",
      newTheme === "dark"
    );
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
        strategy="afterInteractive"
        onLoad={() => setIsGoogleMapsLoaded(true)}
      />
      <Component
        {...pageProps}
        theme={theme}
        toggleTheme={toggleTheme}
        isGoogleMapsLoaded={isGoogleMapsLoaded}
      />
    </>
  );
}