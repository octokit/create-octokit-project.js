module.exports = createIssueTemplates;

const writePrettyFile = require("./write-pretty-file");

async function createIssueTemplates(packageName) {
  await writePrettyFile(
    ".github/ISSUE_TEMPLATE/01_help.md",
    `---
name: "🆘 Help"
about: "How does this even work 🤷‍♂️"
labels: support
---
`
  );

  await writePrettyFile(
    ".github/ISSUE_TEMPLATE/02_bug.md",
    `---
name: "🐛 Bug Report"
about: "If something isn't working as expected 🤔"
labels: bug
---

<!-- Please replace all placeholders such as this below -->

**What happened?**

<!-- Describe the problem and how to reproduce it. Add screenshots or a link to your repository if possible and helpful -->

**What did you expect to happen?**

<!-- Describe what you expected to happen instead -->

**What the problem might be**

<!-- If you have an idea where the bug might lie, please share here. Otherwise remove the whole section -->
`
  );
  await writePrettyFile(
    ".github/ISSUE_TEMPLATE/03_feature_request.md",
    `---
name: "🧚‍♂️ Feature Request"
about: "Wouldn’t it be nice if 💭"
labels: feature
---

<!-- Please replace all placeholders such as this below -->

**What’s missing?**

<!-- Describe your feature idea  -->

**Why?**

<!-- Describe the problem you are facing -->

**Alternatives you tried**

<!-- Describe the workarounds you tried so far and how they worked for you -->
`
  );
  await writePrettyFile(
    ".github/ISSUE_TEMPLATE/04_thanks.md",
    `---
name: "💝 Thank you"
about: "${packageName} is awesome 🙌"
labels: thanks
---

<!-- Please replace all placeholders such as this below -->

**How do you use ${packageName}?**

<!-- Please share how you use ${packageName}. What are your use cases? -->

**What do you love about it?**

<!-- Thanks for the kind words 🤗 -->

**How did you learn about it?**

<!-- Just curious -->
`
  );
}
