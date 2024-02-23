#!/usr/bin/env node

// Required node modules
const fs = require("fs");
const path = require("path");

// Constants
const CONFIG_FILE = "config.xml";
const GOOGLE_SERVICES_DIR = "www/google-services";
const BUILD_PATH = "platforms/android/app/src/main/assets/www/google-services";
const GOOGLE_SERVICES_FILE = "google-services.zip";

/**
 * Extracts the App Identifier from the config.xml file.
 * @returns {string} The App Identifier.
 */
function extractAppId() {
  try {
    const xmlData = fs.readFileSync(CONFIG_FILE, "utf8");
    const match = xmlData.match(/ id="([^"]+)"/);
    return match ? match[1] : "";
  } catch (error) {
    console.error("Error reading config.xml:", error);
    return null;
  }
}

/**
 * Copies the Google Services file to the appropriate location.
 * @param {string} appId The App Identifier.
 */
function copyGoogleServicesFile(appId) {
  try {
    const srcFile = path.join(GOOGLE_SERVICES_DIR, appId, GOOGLE_SERVICES_FILE);
    if (fs.existsSync(srcFile)) {
      fs.mkdirSync(BUILD_PATH, { recursive: true });
      fs.copyFileSync(srcFile, path.join(BUILD_PATH, GOOGLE_SERVICES_FILE));
      console.log("[PUSHWOOSH HELPER] Copied google-services.zip");
    } else {
      console.log("[PUSHWOOSH HELPER] Source file not found:", srcFile);
    }
  } catch (error) {
    console.error("Error copying Google Services file:", error);
  }
}

/**
 * Deletes existing Google Services files if found.
 */
function cleanGoogleServicesFiles() {
  try {
    const filePath = path.join(BUILD_PATH, GOOGLE_SERVICES_FILE);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("[PUSHWOOSH HELPER] Deleted existing file:", filePath);
    }
  } catch (error) {
    console.error("Error deleting existing Google Services file:", error);
  }
}

// Main function
function main() {
  const appId = extractAppId();
  if (appId) {
    console.log("[PUSHWOOSH HELPER] App Identifier detected:", appId);
    cleanGoogleServicesFiles();
    copyGoogleServicesFile(appId);
  } else {
    console.log("[PUSHWOOSH HELPER] App Identifier not found in config.xml");
  }
}

main();