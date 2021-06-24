# Miro App: Kanban Statistics

## Development

### Todo-List

- make `npm run lint` work
- Describe running the app in README
- Clarify first setup -> What do I need to do when I'm new to the project?
  - 1) Create a miro Board in the miro App
  - 2) In Miro Configuration -> Your Apps -> Local Testing App
  - Important: Permissions
- Change the "Hello" message on http://localhost:.../ to sth meaningful

### Build the Project

```sh
npm install
npm run build
npm run test
npm run lint
```


### Run a Local Version
Provida a the application on a simple local webserver

```sh
npm run local
```

Afterwarts, the result is available at the address http://localhost:8081


### Testing

To run all tests once simply state 
```sh
npm run test
```

To continuously monitor the tests while developing

```sh
npm run test:watch
```

### Linter and Code Style

Before pushing to github, please run all tests and the linter

```sh
npm run test
npm run lint
```

### Analyze the Code Complexity

```sh
npm run complexity
```

The command above uses the [complexity-report-html](https://github.com/igneel64/complexity-report-html) module to generate two reports

- `.complexity-report/app.html` shows an overview of complexity by file and function for the `app` folder
- `.complexity-report/test.html` shows an overview of complexity by file and function for the `test` folder


### Hint for Developers Using Windows

If you're using windows and git bash, you might run into the problem, that the build script creates a directory "-p" in your local repository instead of working directly.

The root cause of the problem is, that npm scripts are run in the default shell, which is usualle the windows command prompt.

You can change this by configuring npm to use a different shell, e.g. the git bash:

```
npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"
```

*By the way, you can remove this directory by using ```rmdir ./-p``` - but you got this covered already, didn't you?*