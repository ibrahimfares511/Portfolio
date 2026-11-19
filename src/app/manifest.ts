import type { MetadataRoute } from "next";

/** Web app manifest: name, colours and icons for "Add to home screen" and Android. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ibrahim Fares · إبراهيم فارس",
    short_name: "Ibrahim Fares",
    start_url: "/",
    display: "browser",
    background_color: "#F3EFE9",
    theme_color: "#16303A",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
