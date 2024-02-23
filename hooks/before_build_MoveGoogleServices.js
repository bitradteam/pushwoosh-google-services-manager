#!/usr/bin/env node

//global variables
var appId = "";
var utils = require("./utils");

// required node modules
var fs = require('fs');
var path = require('path');

// determine appId (read it from config.xml)
var configFile = "config.xml";
var xmlData = fs.readFileSync(configFile).toString('utf8');

var n = xmlData.search(" id=\"");
if (n > 0) {
  n += 5;
  var count = 0;
  var cont = true;
  while (cont) {
    if (xmlData[n + count] == "\"") {
      cont = false;
    } else {
      count++;
    }
  }
  appId = xmlData.substring(n, n + count);
  console.log("[PUSHWOOSH HELPER] App Identifier detected: " + appId);
}

/**
 * Get the absolute path to the location that Google Services
 * file should be placed, depending on the platform.
 * @param {object} context Cordova context
 * @returns {string} Absolute path to the location google
 * services file must be placed
 */
function getGoogleServiceTargetDir(context) {
  var platformPath = utils.getPlatformPath(context);
  var platform = context.opts.plugin.platform;
  switch (platform) {
    case "android": {
      var platformVersion = utils.getPlatformVersion(context);
      var majorPlatformVersion = platformVersion.split(".")[0];
      if (parseInt(majorPlatformVersion) >= 7) {
        return path.join(platformPath, "app");
      } else {
        return platformPath;
      }
    }
    case "ios":
      return platformPath;
    default:
      return undefined;
  }
}

//function to copy the file
function copyGoogleServicesFile() {
  var srcFile = path.join("www/google-services", appId, "google-services.zip");
  console.log("[PUSHWOOSH HELPER] Source file path: " + srcFile);
  if (fs.existsSync(srcFile)) {
    var buildPath = "platforms/android/app/src/main/assets/www/google-services";
    fs.mkdirSync(buildPath, { recursive: true });
    console.log("[PUSHWOOSH HELPER] File exists.");
    fs.createReadStream(srcFile).pipe(fs.createWriteStream(path.join(buildPath, "google-services.zip")));
    console.log("[PUSHWOOSH HELPER] File was copied into " + path.join(buildPath, "google-services.zip") + ".");
  }
};

//function to check if google services files already exist and dispose of them
function cleanGoogleServicesFile() {
  var targetDir = getGoogleServiceTargetDir(context);

  // Check if files exist and delete them if found
  var existingFiles = ["google-services.json", "GoogleService-Info.plist"];
  existingFiles.forEach(function (file) {
    var filePath = path.join(targetDir, file);
    console.log("[PUSHWOOSH HELPER] File path:", filePath);
    console.log("[PUSHWOOSH HELPER] File exists?:", fs.existsSync(filePath))
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("[PUSHWOOSH HELPER] Deleted existing file:", filePath);
    }
  });
}

cleanGoogleServicesFile();
copyGoogleServicesFile();