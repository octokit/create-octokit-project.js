module.exports = createLicense;

const { writeFile } = require("fs").promises;

const { licenseText } = require("spdx-license-list/licenses/MIT");

async function createLicense(name) {
  const mitLicenseText = licenseText
    .replace("<year>", new Date().getFullYear())
    .replace("<copyright holders>", name);
  await writeFile("LICENSE", mitLicenseText + "\n");
}
