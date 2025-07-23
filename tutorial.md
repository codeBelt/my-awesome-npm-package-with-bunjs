# Creating and Publishing NPM Packages with Bun.js: A Complete Guide

Building and publishing NPM packages has traditionally involved several tools and configuration steps. With Bun.js, this process becomes significantly more streamlined. This guide will walk you through creating, bundling, and publishing an NPM package using Bun.js.

## Introduction

[Bun.js](https://bun.sh) is a modern JavaScript runtime, bundler, test runner, and package manager all in one. Its speed and simplicity make it an excellent choice for package development. In this guide, we'll create a simple utility package with TypeScript and publish it to npm.

## Setting Up Your Project

First, make sure you have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

Now, initialize a new Bun project:

```bash
mkdir my-awesome-npm-package-with-bunjs
cd my-awesome-npm-package-with-bunjs
bun init
```

Answer the prompts to set up your project. Be sure to choose a unique package name that isn't already on npm.

## Project Structure

Let's create a simple but practical package structure:

```bash
mkdir -p src
touch src/index.ts
touch src/types.ts
touch src/stringUtils.ts
touch src/numberUtils.ts
```

## Writing Your Package Code

Let's implement some useful utility functions and types. First, define your types:

```typescript
// src/types.ts
export interface StringFormatter {
 capitalize: (str: string) => string;
 reverse: (str: string) => string;
 countWords: (str: string) => number;
}

export interface NumberUtils {
 isEven: (num: number) => boolean;
 isOdd: (num: number) => boolean;
 sum: (nums: number[]) => number;
}
```

Now, implement the functions in separate files:

```typescript
// src/stringUtils.ts
import type { StringFormatter } from './types';

export const stringUtils: StringFormatter = {
 capitalize: (str) => {
 return str.charAt(0).toUpperCase() + str.slice(1);
 },
 reverse: (str) => {
 return str.split('').reverse().join('');
 },
 countWords: (str) => {
 return str.split(/\s+/).filter(Boolean).length;
 },
};
```

```typescript
// src/numberUtils.ts
import type { NumberUtils } from './types';

export const numberUtils: NumberUtils = {
 isEven: (num) => num % 2 === 0,
 isOdd: (num) => num % 2 !== 0,
 sum: (nums) => nums.reduce((acc, val) => acc + val, 0),
};
```

Finally, create the main entry point that re-exports everything:

```typescript
// src/index.ts
// Export utilities
export { stringUtils } from './stringUtils';
export { numberUtils } from './numberUtils';

// Export types for consumers
export type { StringFormatter, NumberUtils } from './types';
```

This modular structure makes your codebase more maintainable as it grows. Each utility has its own file, and the index.ts file serves as the public API for your package.

## Configuring Your Package

Update your `package.json` to define the package configuration:

```json
{
 "name": "my-awesome-npm-package-with-bunjs",
 "version": "0.1.0",
 "module": "dist/index.mjs",
 "main": "dist/index.js",
 "types": "dist/index.d.ts",
 "files": [
 "dist"
 ],
 "exports": {
 ".": {
 "import": "./dist/index.mjs",
 "require": "./dist/index.js",
 "types": "./dist/index.d.ts"
 }
 },
 "scripts": {
 "build": "bun build ./src/index.ts --outdir ./dist --format esm && bun build ./src/index.ts --outdir ./dist --format cjs",
 "watch": "bun build ./src/index.ts --outdir ./dist --format esm --watch",
 "prepublishOnly": "bun run build",
 "test": "bun test",
 "test:watch": "bun test --watch",
 "test:coverage": "bun test --coverage",
 "link": "bun link",
 "unlink": "bun unlink",
 "version:patch": "bun version patch",
 "version:minor": "bun version minor",
 "version:major": "bun version major",
 "version:beta": "bun version preminor --preid beta",
 "version:alpha": "bun version preminor --preid alpha",
 "version:rc": "bun version preminor --preid rc",
 "version:prerelease": "bun version prerelease",
 "publish": "bun publish",
 "publish:beta": "bun publish --tag beta",
 "publish:alpha": "bun publish --tag alpha",
 "publish:rc": "bun publish --tag rc"
 },
 "devDependencies": {
 "bun-types": "latest"
 }
}
```

Now, create a `tsconfig.json` file:

```json
{
 "compilerOptions": {
 "target": "ESNext",
 "module": "ESNext",
 "moduleResolution": "node",
 "esModuleInterop": true,
 "strict": true,
 "declaration": true,
 "outDir": "./dist",
 "skipLibCheck": true,
 "forceConsistentCasingInFileNames": true
 },
 "include": ["src/**/*"]
}
```

## Bundling for Different Module Systems

Bun.js can bundle your package for different module systems. Our `package.json` already defines outputs for both ESM and CommonJS, which are the most important modern module formats.

To build your package:

```bash
bun run build
```

This will generate:
- `dist/index.mjs` (ESM format)
- `dist/index.js` (CommonJS format)
- `dist/index.d.ts` (TypeScript declarations)

### Understanding the Module Formats

1. **ESM (ECMAScript Modules)** - The modern standard using `import` and `export`
2. **CommonJS** - The traditional Node.js format using `require()` and `module.exports`

Our configuration with the `exports` field in `package.json` ensures that:
- Modern tools using ESM imports will use the `.mjs` file
- Traditional Node.js applications will use the `.js` file
- TypeScript will use the declaration files

Bun handles the bundling process efficiently, eliminating the need for additional tools like Rollup, Webpack, or esbuild.

## Testing Your Package Locally

Before publishing, it's essential to test your package locally. Bun makes this process straightforward with its linking capabilities.

### Linking Your Package

Linking creates a symbolic connection between your package and the global packages directory, allowing you to use your local package in other projects:

```bash
# In your package directory
cd my-awesome-npm-package-with-bunjs
bun run build # Make sure your package is built
bun link # Register your package globally
```

### Testing in Another Project

Now, create a test project to consume your package:

```bash
# Create a test project
mkdir test-my-package
cd test-my-package
bun init

# Link to your local package
bun link my-awesome-npm-package-with-bunjs
```

Create a test file:

```typescript
// test.ts
import { stringUtils, numberUtils } from 'my-awesome-npm-package-with-bunjs';

console.log(stringUtils.capitalize('hello world')); // Hello world
console.log(stringUtils.reverse('bun.js')); // sj.nub
console.log(numberUtils.isEven(42)); // true
```

Run it:

```bash
bun test.ts
```

### Development Workflow with Local Linking

When you're actively developing your package, you'll want to test changes without constantly republishing. Here's an efficient workflow:

1. Make changes to your package code
2. Rebuild your package: `bun run build`
3. The changes will automatically be available in your test project

If you're making frequent changes, consider setting up a watch mode to automatically rebuild:

```json
// In your package.json, add this to scripts:
"watch": "bun build ./src/index.ts --outdir ./dist --format esm --watch"
```

Run `bun run watch` in one terminal, and test your changes in another terminal.

### Troubleshooting Links

If you encounter issues with linking:

1. Ensure your package is properly built before linking
2. Try unlinking and relinking:
 ```bash
 # In the test project
 bun unlink my-awesome-npm-package-with-bunjs
 
 # In your package directory
 bun link
 
 # Back in the test project
 bun link my-awesome-npm-package-with-bunjs
 ```
3. Check for path issues in your package.json exports

### Using npm link or yarn link

If you're working in an environment where you need to use npm or yarn:

```bash
# Using npm
npm link # In your package directory
npm link my-awesome-npm-package-with-bunjs # In your test project

# Using yarn
yarn link # In your package directory
yarn link my-awesome-npm-package-with-bunjs # In your test project
```

Bun will recognize these links as well, providing flexibility across different package managers.

### Unlinking When Development is Complete

Once you've finished developing and testing your package, it's good practice to unlink it before publishing:

```bash
# In your test project
cd test-my-package
bun unlink my-awesome-npm-package-with-bunjs

# In your package directory
cd ../my-awesome-npm-package-with-bunjs
bun unlink
```

This removes the symbolic links created during development. Unlinking is important because:

1. It prevents confusion between the globally linked version and the published version
2. It ensures your final tests are done with the actual package as it will be published
3. It keeps your global package space clean

If you used npm or yarn for linking:

```bash
# Using npm
npm unlink my-awesome-npm-package-with-bunjs # In your test project
npm unlink # In your package directory

# Using yarn
yarn unlink my-awesome-npm-package-with-bunjs # In your test project
yarn unlink # In your package directory
```

After unlinking, you can verify your published package by installing it directly:

```bash
# In your test project
bun add my-awesome-npm-package-with-bunjs
```

This will install the published version from npm, allowing you to confirm everything works as expected.

## Publishing to NPM

Before publishing, you need an npm account. If you don't have one:

```bash
bun login
```

Ensure your `package.json` has the correct:
- name (unique on npm)
- version
- description
- keywords
- license

Add a README.md file to help users understand your package:

```markdown
# My Awesome NPM Package with Bun.js

A collection of string and number utility functions built with Bun.js.

## Installation

```bash
# Using npm
npm install my-awesome-npm-package-with-bunjs

# Using Bun
bun add my-awesome-npm-package-with-bunjs
```

## Usage

```typescript
import { stringUtils, numberUtils } from 'my-awesome-npm-package-with-bunjs';

// String utilities
stringUtils.capitalize('hello'); // 'Hello'
stringUtils.reverse('bun.js'); // 'sj.nub'
stringUtils.countWords('hello world'); // 2

// Number utilities
numberUtils.isEven(42); // true
numberUtils.isOdd(17); // true
numberUtils.sum([1, 2, 3, 4]); // 10
```

### Using TypeScript Types

The package also exports its TypeScript types, which you can use in your own code:

```typescript
import { stringUtils, numberUtils, type StringFormatter, type NumberUtils } from 'my-awesome-npm-package-with-bunjs';

// Using the types for your own implementations
const myCustomStringUtils: StringFormatter = {
 capitalize: (str) => ` ${str.charAt(0).toUpperCase()}${str.slice(1)} `,
 reverse: (str) => str.split('').reverse().join('') + '!',
 countWords: (str) => str.split(/\s+/).filter(Boolean).length,
};

// Extending the types
interface ExtendedStringFormatter extends StringFormatter {
 truncate: (str: string, length: number) => string;
}

// Implementing extended types
const extendedUtils: ExtendedStringFormatter = {
 ...stringUtils, // Reuse the original implementations
 truncate: (str, length) => str.length > length ? str.slice(0, length) + '...' : str,
};

// Type checking for function parameters
function processString(formatter: StringFormatter, input: string): string {
 return formatter.capitalize(input);
}

// Using the imported utilities directly with type safety
processString(stringUtils, 'hello world'); // Works
// processString(numberUtils, 'hello world'); // TypeScript error!
```

By leveraging TypeScript types from the package, you get:
- Type safety when using the package's functions
- Ability to extend and implement your own versions of the interfaces
- Better IDE support with autocomplete and documentation
```

Finally, publish your package:

```bash
bun publish
```

## Creating Pre-releases

Before publishing an official release, it's often useful to create a pre-release version for testing. This allows you to publish a version that early adopters can try without affecting users who depend on stable releases.

### Tagging Pre-releases

In semantic versioning, pre-releases use tags like `alpha`, `beta`, or `rc` (release candidate). To create a pre-release version, update your version in `package.json`:

```json
{
 "name": "my-awesome-npm-package-with-bunjs",
 "version": "0.1.0-beta.1",
 "module": "dist/index.mjs",
 // ... rest of your package.json
}
```

You can also use Bun's version command with a pre-release identifier:

```bash
bun version prepatch --preid beta
# Changes version from 0.1.0 to 0.1.1-beta.0

bun version preminor --preid alpha
# Changes version from 0.1.0 to 0.2.0-alpha.0

bun version premajor --preid rc
# Changes version from 0.1.0 to 1.0.0-rc.0
```

### Publishing Pre-releases

To publish a pre-release, use the same `bun publish` command with the `--tag` flag:

```bash
bun publish --tag beta
```

This publishes your package with the specified tag instead of the default `latest` tag. Users will only get this version if they explicitly request it.

### Installing Pre-releases

To install a pre-release version:

```bash
# Install the latest beta version
bun add my-awesome-npm-package-with-bunjs@beta

# Install a specific pre-release version
bun add my-awesome-npm-package-with-bunjs@0.1.0-beta.1
```

### Testing Workflow for Pre-releases

Here's an effective workflow for pre-releases:

1. Make your changes and build the package
2. Update to a pre-release version: `bun version preminor --preid beta`
3. Publish with a tag: `bun publish --tag beta`
4. Test in a real project: `bun add my-awesome-npm-package-with-bunjs@beta`
5. Make any needed fixes and publish updates: `bun version prerelease` (increments to beta.1, beta.2, etc.)
6. Once stable, publish the final version:
 ```bash
 bun version minor # Or patch/major as appropriate
 bun publish
 ```

### Viewing Your Package Versions

To see all published versions of your package:

```bash
bun pm view my-awesome-npm-package-with-bunjs versions
```

To see all tagged versions:

```bash
bun pm view my-awesome-npm-package-with-bunjs dist-tags
```

Pre-releases are an excellent way to get feedback and test your package in real-world environments before committing to a stable release.

## Versioning and Updates

When you make changes to your package, increment the version in `package.json` following semantic versioning (semver) principles:

- Patch version (`0.0.x`) for bug fixes
- Minor version (`0.x.0`) for new features that don't break existing functionality
- Major version (`x.0.0`) for breaking changes

Then republish:

```bash
bun version patch # or 'minor' or 'major'
bun publish
```

## Conclusion

Bun.js simplifies the process of creating and publishing NPM packages by providing an all-in-one solution for:

1. Project initialization
2. TypeScript support
3. Bundling for multiple module formats
4. Testing
5. Publishing

With Bun's speed and simplicity, you can focus more on your package functionality and less on configuration and tooling. The bundler's efficiency also results in smaller package sizes, which benefits your users.

Happy coding with Bun.js!

## Bonus: Testing Your Package with Bun

Bun comes with a built-in test runner that makes it easy to write and run tests for your package. Let's add tests for our utility functions.

### Setting Up the Test Structure

First, create a tests directory:

```bash
mkdir -p test
touch test/stringUtils.test.ts
touch test/numberUtils.test.ts
```

### Writing Tests

Bun provides a testing API similar to Jest or Vitest. Let's write tests for our string utilities:

```typescript
// test/stringUtils.test.ts
import { expect, test, describe } from "bun:test";
import { stringUtils } from "../src/stringUtils";

describe("stringUtils", () => {
 describe("capitalize", () => {
 test("capitalizes the first letter of a string", () => {
 expect(stringUtils.capitalize("hello")).toBe("Hello");
 });

 test("returns empty string for empty input", () => {
 expect(stringUtils.capitalize("")).toBe("");
 });
 });

 describe("reverse", () => {
 test("reverses the characters in a string", () => {
 expect(stringUtils.reverse("hello")).toBe("olleh");
 });

 test("handles empty string", () => {
 expect(stringUtils.reverse("")).toBe("");
 });
 });

 describe("countWords", () => {
 test("counts words in a string", () => {
 expect(stringUtils.countWords("hello world")).toBe(2);
 });

 test("handles empty string", () => {
 expect(stringUtils.countWords("")).toBe(0);
 });

 test("handles multiple spaces", () => {
 expect(stringUtils.countWords("hello world test")).toBe(3);
 });
 });
});
```

And for our number utilities:

```typescript
// test/numberUtils.test.ts
import { expect, test, describe } from "bun:test";
import { numberUtils } from "../src/numberUtils";

describe("numberUtils", () => {
 describe("isEven", () => {
 test("returns true for even numbers", () => {
 expect(numberUtils.isEven(2)).toBe(true);
 expect(numberUtils.isEven(100)).toBe(true);
 });

 test("returns false for odd numbers", () => {
 expect(numberUtils.isEven(1)).toBe(false);
 expect(numberUtils.isEven(99)).toBe(false);
 });
 });

 describe("isOdd", () => {
 test("returns true for odd numbers", () => {
 expect(numberUtils.isOdd(1)).toBe(true);
 expect(numberUtils.isOdd(99)).toBe(true);
 });

 test("returns false for even numbers", () => {
 expect(numberUtils.isOdd(2)).toBe(false);
 expect(numberUtils.isOdd(100)).toBe(false);
 });
 });

 describe("sum", () => {
 test("sums an array of numbers", () => {
 expect(numberUtils.sum([1, 2, 3, 4])).toBe(10);
 });

 test("returns 0 for empty array", () => {
 expect(numberUtils.sum([])).toBe(0);
 });
 });
});
```

### Update package.json

Add a test script to your package.json:

```json
{
 "scripts": {
 "build": "bun build ./src/index.ts --outdir ./dist --format esm && bun build ./src/index.ts --outdir ./dist --format cjs",
 "watch": "bun build ./src/index.ts --outdir ./dist --format esm --watch",
 "prepublishOnly": "bun run build",
 "test": "bun test",
 "test:watch": "bun test --watch",
 "test:coverage": "bun test --coverage",
 "link": "bun link",
 "unlink": "bun unlink",
 "version:patch": "bun version patch",
 "version:minor": "bun version minor",
 "version:major": "bun version major",
 "version:beta": "bun version preminor --preid beta",
 "version:alpha": "bun version preminor --preid alpha",
 "version:rc": "bun version preminor --preid rc",
 "version:prerelease": "bun version prerelease",
 "publish": "bun publish",
 "publish:beta": "bun publish --tag beta",
 "publish:alpha": "bun publish --tag alpha",
 "publish:rc": "bun publish --tag rc"
 }
}
```

### Running Tests

Now you can run your tests with:

```bash
bun test
```

Bun's test runner will automatically find and execute all test files. You'll see a nicely formatted output with test results.

### Advanced Testing Features

Bun's test runner comes with several advanced features:

#### Watch Mode

To automatically run tests when files change:

```bash
bun test --watch
```

#### Test Coverage

To generate test coverage reports:

```bash
bun test --coverage
```

#### Filtering Tests

Run specific tests by name:

```bash
bun test --test-name="capitalize" 
```

#### Mocking

Bun provides built-in mock support similar to Jest:

```typescript
import { mock } from "bun:test";

// Create a mock function
const logMock = mock((message: string) => console.log(message));

// Use in tests
test("calls log function", () => {
 someFunction(logMock);
 expect(logMock).toHaveBeenCalled();
});
```

#### Setup and Teardown

Use `beforeAll`, `afterAll`, `beforeEach`, and `afterEach` for test setup and cleanup:

```typescript
import { beforeEach, afterEach, describe, test } from "bun:test";

describe("testing with setup", () => {
 beforeEach(() => {
 // Run before each test
 });
 
 afterEach(() => {
 // Run after each test
 });
 
 test("example test", () => {
 // Test code
 });
});
```

### Testing Strategies for npm Packages

When testing an npm package, it's a good practice to:

1. **Test the public API**: Focus on testing the functions and types that users will actually import
2. **Test edge cases**: Ensure your utilities handle empty inputs, null values, and other edge cases
3. **Test for correct type errors**: If using TypeScript, you can use `@ts-expect-error` to verify type errors
4. **Add integration tests**: Create an example project that imports your package to verify it works as expected

With Bun's comprehensive testing capabilities, you can ensure your package is reliable and robust before publishing.

---

_If you found this guide helpful, please consider following me on Medium and checking out my other articles on modern JavaScript development._ 