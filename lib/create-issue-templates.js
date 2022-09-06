module.exports = createIssueTemplates;

const writePrettyFile = require("./write-pretty-file");

async function createIssueTemplates(isOctokitOrg) {
  if (isOctokitOrg) {
    await writePrettyFile(
      ".github/ISSUE_TEMPLATE/01_bug.md",
      `---
  name: "🐛 Bug Report"
  about: "If something isn't working as expected 🤔"
  labels: bug
  ---
  
  <!-- Please replace all placeholders such as this below -->
  
  **What happened?**
  
  <!-- Describe the problem and how to reproduce it. Add screenshots or a link to your repository if helpful. Ideally create a reproducible test case on runkit.com (Example: https://runkit.com/gr2m/octokit-rest-js-1808) -->
  
  **What did you expect to happen?**
  
  <!-- Describe what you expected to happen instead -->
  
  **What the problem might be**
  
  <!-- If you have an idea where the bug might lie, please share here. Otherwise remove the whole section -->
  `
    );
    await writePrettyFile(
      ".github/ISSUE_TEMPLATE/02_feature_request.md",
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
      ".github/ISSUE_TEMPLATE/config.yml",
      `blank_issues_enabled: false
contact_links:
  - name: 🆘 I need Help
    url: https://github.com/octokit/octokit.js/discussions
    about: Got a question? An idea? Feedback? Start here.`
    );
    return;
  }

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
}
