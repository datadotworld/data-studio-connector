# Contributing Guidelines

## General

* Contributions of all kinds (issues, ideas, proposals), not just code, are highly appreciated.
* Pull requests are welcome with the understanding that major changes will be carefully evaluated 
and discussed, and may not always be accepted. Starting with a discussion is always best!
* All contributions including documentation, filenames and discussions should be written in English language.

## Issues

Our [issue tracker](https://github.com/datadotworld/data-studio-connector/issues) can be used to report 
issues and propose changes to the current or next version of the data.world Web Data Connector.

## Contribute Code

### Review Relevant Docs

* [Google Data Studio — Community Connector Docs](https://developers.google.com/datastudio/connector/)
* [data.world API](https://docs.data.world/documentation/api)

### Set up machine

Install:

* NodeJS
* npm
* [node-google-apps-script](https://github.com/danthareja/node-google-apps-script)

### Fork the Project

Fork the [project on Github](https://github.com/datadotworld/data-studio-connector) and check out your copy.

```
git clone https://github.com/[YOUR_GITHUB_NAME]/data-studio-connector.git
cd tableau-connector
git remote add upstream https://github.com/datadotworld/data-studio-connector.git
```

### Development Workflow

This project's setup is inspired by ideas in this blog post: 
<https://developers.googleblog.com/2015/12/advanced-development-process-with-apps.html>

Most importantly, unlike traditional Google Apps Script projects **your local file set is the 
master**. That also means that code is managed in Git and deployed and "deployed" to Google Apps
Script using [node-google-apps-script](https://github.com/danthareja/node-google-apps-script).

**HELP WANTED**

There is much to do in the way of adopting some best practices described in the same article, namely:
- Use specific configuration values for “local” development.
- Build test methods that can run standalone.
- Include dependencies for development and testing.

Also, automation with CircleCI is highly desired.

#### Development environment

To run the connector:

1. Install and configure `node-google-apps-script`
1. Setup your own Google Apps Script project to be used for development
1. Modify `gapps.config.json` and change `fileId` to be that of your project file
1. Run `gapps` upload

Using the Google Apps Script Editor:
1. Make sure that **View > Show manifest file** is enabled
1. Review `appsscript.json` file (Project Manifest) manually; update manually if needed
1. Go to **Publish > Deploy as > Custom from manifest** 

For additional instructions related to initial deployment, see 
<https://developers.google.com/datastudio/connector/versioning#initialdeplyoment>

**Script Properties**

Two script properties are required in the Google Apps Script project for the connector to work:

1. `oauthClientId`: data.world OAuth client id
1. `oauthClientSecret`: data.world OAuth client secret

Script properties can be saved via the script editor user interface by going to **File > Project 
properties** and selecting the Script properties tab.

### Write Tests

Try to write a test that reproduces the problem you're trying to fix or describes a feature that 
you want to build.

We definitely appreciate pull requests that highlight or reproduce a problem, even without a fix.

### Write Code

Implement your feature or bug fix.
Make sure that all tests pass.

### Write Documentation

Document any external behavior in the [README](README.md).

### Commit Changes

Make sure git knows your name and email address:

```bash
git config --global user.name "Your Name"
git config --global user.email "contributor@example.com"
```

Writing good commit logs is important. A commit log should describe what changed and why.

```bash
git add ...
git commit
```

### Push

```bash
git push origin my-feature-branch
```

### Make a Pull Request

Go to <https://github.com/[YOUR_GITHUB_NAME]/data-studio-connector> and select your feature branch. 
Click the 'Pull Request' button and fill out the form. Pull requests are usually reviewed within 
a few days.

## Thank you!

Thank you in advance, for contributing to this project!