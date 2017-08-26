"use strict";

const SONAR = require("sonarqube-scanner");
const EXCLUSIONS = [
    ".scannerwork/**",
    ".sonarlint/**",
    ".vscode/**",
    "coverage/**",
    "docs/**", 
    "node_modules/**",
    "spec/**",
    "tutorials/**",
    "sonar.js"
];

SONAR({
  "serverUrl": "https://sw-gis.de:8082",
  token: "14376d6b8aa27f68bd13d064b0fc51d3320368a1",
  options: {
    "sonar.javascript.lcov.reportPaths": "coverage/lcov.info",
    "sonar.exclusions": EXCLUSIONS.join()
  }
}, () => {
  // nothing to do here
});
