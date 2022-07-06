# directcommit
Convenient API layer that allows end users to make changes to files in a repository without having to go through the pull request workflow. Useful for wikis.

## Background
It is common for a website to have an “Edit this page on GitHub” button. However, the user has to go through the pull request workflow (fork the repository, make changes, commit, push, submit a pull request). This introduces a lot of friction and complexity for the user.

## Prerequisites
- A GitHub App (for making edits)
- A GitHub OAuth app (for authenticating end users)
- A Firebase Project with GitHub authentication method
