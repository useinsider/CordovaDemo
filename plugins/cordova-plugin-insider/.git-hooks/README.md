# Git Hooks

## 📌 Purpose
This directory uses Git hooks to enforce standards and automate tasks during the development workflow.  
The main example included is a **`commit-msg`** hook that enforces [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) rules with additional project-specific logic.

---

## 📂 Hooks Included

### 1. `commit-msg`
Ensures commit messages follow the Conventional Commits specification, with custom rules:

- **Bypasses**:
  - `Merge branch ...` commits (merge commits)
  - `pick ...`, `reword ...`, `edit ...`, `squash ...`, `fixup ...`, `exec ...` messages (interactive rebase auto-generated commits)
- **JIRA Reference**:
  - If the branch name contains a JIRA ID in the form `MOB-1234`, it will automatically append  
    `#Ref: MOB-1234` to the end of the commit message (if not already present).
- **Optional Description**:
  - `<type>[<scope>][!]: <description>` — the description can be empty.
- **Header length**:
  - Max 120 characters (hard limit)
  - Warning if over 50 or 72 characters.

---

## 🔧 Installation

### 1. Copy Hooks to `.git/hooks/`

Run the following commands under project's directory:
```bash
cp .git-hooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
```
