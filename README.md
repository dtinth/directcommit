# directcommit

Convenient API layer that allows end users to make changes to files in a repository without having to go through the pull request workflow. Useful for building wikis.

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

This GitHub App will be used to access the repository contents.

1. Create a GitHub App
   - Uncheck **Webhook** &rarr; **Active**
   - Permissions:
     - **Contents** &rarr; **Read and write**
2. Note the **App ID**
3. Generate and download the private key
4. Go to **Install App** and install it on the repository.

### Create a GitHub OAuth app

This GitHub OAuth app will be used to authenticate end users.

1. Create an OAuth application
2. Note the **Client ID**
3. Generate and note the **Client Secret**

### Create a Firebase project

This Firebase app will be used to provide authentication layer to the frontend.

1. Create a Firebase project
2. [Under **Auth**, enable the **GitHub provider**](https://firebase.google.com/docs/auth/web/github-auth)
3. Integrate Firebase Authentication with your web application

### Integrate with frontend

1. Let user [log in using their GitHub account](https://firebase.google.com/docs/auth/web/github-auth).
2. Obtain the ID token by calling the [`getIdToken` method](https://firebase.google.com/docs/reference/js/auth.user#usergetidtoken) on [the `auth.currentUser` object](https://firebase.google.com/docs/reference/js/auth.auth.md#authcurrentuser).

See [example](https://github.com/dtinth/directcommit-example/blob/main/public/index.html) ([see deployed](https://directcommit.firebaseapp.com/)).