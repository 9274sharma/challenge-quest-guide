import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yash9274sharma.challengequest",
  appName: "Challengly",
  webDir: "dist",
  server: {
    url: "http://localhost:8080/",
    // url: "http://192.168.1.12:8080/",
    cleartext: true,
  },
};

export default config;
