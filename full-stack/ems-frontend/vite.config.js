import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const useLocalHttps =
    command === "serve" &&
    env.CERTIFICATE &&
    env.CERT_KEY &&
    fs.existsSync(env.CERTIFICATE) &&
    fs.existsSync(env.CERT_KEY);

  return {
    plugins: [react()],

    server: {
      port: 3000,
      ...(useLocalHttps
        ? {
            https: {
              cert: fs.readFileSync(env.CERTIFICATE),
              key: fs.readFileSync(env.CERT_KEY),
            },
          }
        : {}),
    },
  };
});
