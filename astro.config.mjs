// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// Standalone mode (default) runs the site without the Wix runtime, so it can
// be developed and deployed anywhere (Vercel, Netlify, Cloudflare, GitHub Pages).
// Set WIX=1 to enable the full Wix integration (requires the Wix CLI + auth).
const isWix = process.env.WIX === "1";
const isBuild = process.env.NODE_ENV === "production";
const base = process.env.ASTRO_BASE || "/";

const config = {
  base,
  output: isWix ? "server" : "static",
  integrations: [tailwind(), react()],
  devToolbar: {
    enabled: false,
  },
  image: {
    domains: ["static.wixstatic.com"],
  },
  server: {
    allowedHosts: true,
    host: true,
  },
  security: {
    checkOrigin: false,
  },
};

if (isWix) {
  const cloudProviderFetchAdapter = (await import("@wix/cloud-provider-fetch-adapter")).default;
  const wix = (await import("@wix/astro")).default;
  const monitoring = (await import("@wix/monitoring-astro")).default;
  const sourceAttrsPlugin = (await import("@wix/babel-plugin-jsx-source-attrs")).default;
  const dynamicDataPlugin = (await import("@wix/babel-plugin-jsx-dynamic-data")).default;
  const postcssPseudoToData = (await import("@wix/postcss-pseudo-to-data")).default;

  config.output = "server";
  config.integrations = [
    tailwind(),
    wix({
      htmlEmbeds: isBuild,
      auth: true,
    }),
    ...(isBuild ? [monitoring()] : []),
    react(isBuild ? {} : {
      babel: { plugins: [sourceAttrsPlugin, dynamicDataPlugin] },
    }),
  ];
  config.vite = {
    cacheDir: "node_modules/.cache/.vite",
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "zustand",
        "framer-motion",
        "date-fns",
        "clsx",
        "class-variance-authority",
        "tailwind-merge",
        "@radix-ui/*",
        "@wix/*",
        "zod",
      ],
    },
    css: !isBuild
      ? {
          postcss: {
            plugins: [postcssPseudoToData()],
          },
        }
      : undefined,
  };
  if (isBuild) {
    config.adapter = cloudProviderFetchAdapter({});
  }
}

// https://astro.build/config
export default defineConfig(config);
