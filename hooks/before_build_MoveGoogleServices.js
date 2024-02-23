#!/usr/bin/env node

// Required node modules
const fs = require("fs");
const path = require("path");

/**
 * Extracts the App Identifier from the config.xml file.
 * @returns {string} The App Identifier.
 */
function extractAppId() {
  const configFile = "config.xml";
  const xmlData = fs.readFileSync(configFile, "utf8");
  const match = xmlData.match(/ id="([^"]+)"/);
  return match ? match[1] : "";
}

/**
 * Copies the Google Services file to the appropriate location.
 * @param {string} appId The App Identifier.
 */
function copyGoogleServicesFile(appId) {
  const srcFile = path.join("www/google-services", appId, "google-services.zip");
  if (fs.existsSync(srcFile)) {
    const buildPath = "platforms/android/app/src/main/assets/www/google-services";
    fs.mkdirSync(buildPath, { recursive: true });
    fs.copyFileSync(srcFile, path.join(buildPath, "google-services.zip"));
    console.log("[PUSHWOOSH HELPER] Copied google-services.zip");
  } else {
    console.log("[PUSHWOOSH HELPER] Source file not found:", srcFile);
  }
}

/**
 * Deletes existing Google Services files if found.
 */
function cleanGoogleServicesFiles() {
  const targetDir = 'platforms/android/app/src/main/assets/www/';
  const existingFiles = ["google-services.json", "GoogleService-Info.plist"];
  existingFiles.forEach(file => {
    const filePath = path.join(targetDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("[PUSHWOOSH HELPER] Deleted existing file:", filePath);
    }
  });
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