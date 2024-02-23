#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Extracts the App Identifier from the config.xml file using a regular expression.
 *
 * @returns {string|null} The App Identifier or null if not found.
 */
function extractAppId() {
  const configFile = "config.xml";
  const xmlData = fs.readFileSync(configFile, "utf8");
  const match = xmlData.match(/id="([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Copies the Google Services file to the appropriate location, handling various error scenarios.
 *
 * @param {string} appId The App Identifier.
 */
function copyGoogleServicesFile(appId) {
  const srcFile = path.join("www/google-services", appId, "google-services.zip");

  try {
    if (!fs.existsSync(srcFile)) {
      throw new Error("[PUSHWOOSH HELPER] Source file not found:", srcFile);
    }

    const buildPath = path.join("platforms/android/app/src/main/assets/www/google-services");
    fs.mkdirSync(buildPath, { recursive: true });
    fs.copyFileSync(srcFile, path.join(buildPath, "google-services.zip"));
    console.log("[PUSHWOOSH HELPER] Copied google-services.zip");
  } catch (error) {
    console.error("[PUSHWOOSH HELPER] Error copying Google Services file:", error.message);
  }
}

/**
 * Deletes existing Google Services files if found, gracefully handling errors.
 */
function cleanGoogleServicesFiles() {
  const targetDir = 'platforms/android/app/';
  const filesToDelete = ["google-services.json", "GoogleService-Info.plist"];

  try {
    for (const file of filesToDelete) {
      const filePath = path.join(targetDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("[PUSHWOOSH HELPER] Deleted existing file:", filePath);
      }
    }
  } catch (error) {
    console.error("[PUSHWOOSH HELPER] Error deleting existing Google Services files:", error.message);
  }
}

// Main function
function main() {
  try {
    const appId = extractAppId();
    if (appId) {
      console.log("[PUSHWOOSH HELPER] App Identifier detected:", appId);
      cleanGoogleServicesFiles();
      copyGoogleServicesFile(appId);
    } else {
      console.log("[PUSHWOOSH HELPER] App Identifier not found in config.xml");
    }
  } catch (error) {
    console.error("[PUSHWOOSH HELPER] An error occurred:", error.message);
  }
}

main();