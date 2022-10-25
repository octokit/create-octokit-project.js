export default createLicense;

import { licenseText } from "spdx-license-list/licenses/MIT";

import writePrettyFile from "./write-pretty-file";

async function createLicense(name) {
  const mitLicenseText = licenseText
    .replace("<year>", new Date().getFullYear())
    .replace("<copyright holders>", name);
  await writePrettyFile("LICENSE", mitLicenseText);
}
