import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hair By Debz",
    short_name: "Hair By Debz",
    description: "Frontal installs, ponytails and bridal updos in Northwest London.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFEE9",
    theme_color: "#6E4E37",
    icons: [
      { src: "/brand/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
