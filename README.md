# directcommit

Convenient API layer that allows end users to make changes to files in a repository without having to go through the pull request workflow. Useful for wikis.

## Background

It is common for a website to have an “Edit this page on GitHub” button. However, there are a few problems:

1. **For external contributors,** the user has to go through the pull request workflow (fork the repository, make changes, commit, push, submit a pull request). This introduces a lot of friction and complexity for the user.

2. **For team members,** the user has to get invited into the repository.

This project provides an API for end users to make changes to files in a repository directly. End users doesn’t have to go through the pull request workflow, and if the access rules allows for it, they don’t even have to be a member of the organization.

## Prerequisites

- A GitHub App (for making edits)
- A GitHub OAuth app (for authenticating end users)
- A Firebase Project with GitHub authentication method

## Integration guide

### Create a GitHub App

1. Create a GitHub App
   - Uncheck **Webhook** &rarr; **Active**
   - Permissions:
     - **Contents** &rarr; **Read and write**
2. Note the **App ID**
3. Generate and download the private key
4. Go to **Install App** and install it on the repository.

it works
