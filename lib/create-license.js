module.exports = createLicense;

const { licenseText } = require("spdx-license-list/licenses/MIT");

const writePrettyFile = require("./write-pretty-file");

async function createLicense(name) {
  const mitLicenseText = licenseText
    .replace("<year>", new Date().getFullYear())
    .replace("<copyright holders>", name);
  await writePrettyFile("LICENSE", mitLicenseText);
}
