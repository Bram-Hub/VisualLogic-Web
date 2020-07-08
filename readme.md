#Visual Logic

### Development

Start by cloning the project, installing dependencies and then run the 
page locally.

Dependencies are managed by `npm`, current the following packages are used:

- [Jest](https://jestjs.io/) - used for testing
- [serve](https://www.npmjs.com/package/serve) - used to run a local development server

**Installing dependencies**. From the root directory of the project run the command:

```bash
npm install
```

**Viewing the application locally**

```bash
npx serve
```

The above command will start a local server, copy the URL the project is locally hosted at and view the application in a web browser.

### Testing

Run 
```bash
npm test
```

To run the test suite and generate coverage
*Note: some of the coverage may 
be highlighted incorrectly due to `esm` being used to allow jest to test ES6 JS modules.*

Individual files can be run by:

```bash
npm test -- tests/foo.test.js
```