export default command;

import execa from "execa";

async function command(cmd) {
  console.log(`$ ${cmd}`);
  const { stdout, stderr } = await execa(cmd, { shell: true });
  return [stdout, stderr].filter(Boolean).join("\n");
}
