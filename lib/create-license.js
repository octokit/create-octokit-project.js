export default createLicense;

import mitLicense from "spdx-license-list/licenses/MIT.json" assert { type: "json" };

import writePrettyFile from "./write-pretty-file.js";

async function createLicense(name) {
  const mitLicenseText = mitLicense.licenseText
    .replace("<year>", new Date().getFullYear())
    .replace("<copyright holders>", name);
  await writePrettyFile("LICENSE", mitLicenseText);
}
