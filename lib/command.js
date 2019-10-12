module.exports = command;

const execa = require("execa");

async function command(cmd) {
  console.log(`$ ${cmd}`);
  const { stdout, stderr } = await execa(cmd, { shell: true });
  return [stdout, stderr].filter(Boolean).join("\n");
}
