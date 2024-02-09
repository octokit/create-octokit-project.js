export { createLicense };

import licenseList from "spdx-license-list/full.js";

import { writePrettyFile } from "./write-pretty-file.js";

const licenseText = licenseList.MIT.licenseText;

async function createLicense(name) {
  const mitLicenseText = licenseText
    .replace("<year>", new Date().getFullYear())
    .replace("<copyright holders>", name);
  await writePrettyFile("LICENSE", mitLicenseText);
}
