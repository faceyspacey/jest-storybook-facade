# Jest Storybook Facade
**Jest Storybook Facade** allows you to return *"stories"* (aka React elements) from your `it` tests to produce
your React Storybook. Each `describe` block is one *"story"*, and its `it` blocks the sub-stories. It's fantastic! Yay! Try it.


## Installation
```yarn add jest-storybook-facade```

*storybook config.js:*
```javascript
import 'jest-storybook-facade/storybook-facade.js'
import { configure } from '@kadira/storybook'
...
```

*package.json:*
```javascript
"jest": {
    "setupTestFrameworkScriptFile": "jest-storybook-facade/jest-facade.js",
    ...
```


## Usage:

```javascript
import React from 'react'
import renderer from 'react-test-renderer'

import MyComponent from '../src/MyComponent'
import add from '../src/add'

describe('my test', () => {
  it('does something', () => {
    const element = <MyComponent />
    const tree = renderer.create(element).toJSON()

    expect(tree).toMatchSnapshot()
    return element // will become a story in Storybook, yay!
  })

  it('does something', () => {
    const value = myFunction(1, 2)
    expect(value).toEqual(3)
    // if you don't return anything, no story is displayed
  })
})
```
Yay, it looks just like my regular tests! I can trust this won't break or become a nuisance to my all-import test harness!!!

*...and in fact, you can get started today with your existing tests, just by returning react elements!*

## How It Works

* In Storybook land, globals for `describe`, `it`, `expect`, etc are created by the `storybook-facade.js` file you import. The
Jest environment is essentially mirrored. Under the hood, it creates your stories and spec tests using the `specifications` addon.

* In Jest land, a few minor tweaks are made by `jest-facade.js`: For one, you can now return react elements without penality (typically
undefined or a promise is expected as the return). In addition to `describe`, `it`, `jest`, etc, you have one more global: `storybook`.
And of course it exists on both sides. Here's what it has on it in Jest land:

```javascript
global.storybook = {
  action: name => () => console.log('action', name),
  linkTo: (component, story) => () => console.log('linkTo', component, story),
  withReadme: readme => null,
  knobs: {
    text: (label, value) => value,
    boolean: (label, value) => value,
    number: (label, value, options) => value,
    color: (label, value) => value,
    object: (label, value) => value,
    array: (label, value, separator = ',') => value,
    select: (label, options, value) => value,
    date: (label, value) => value,
  },
  stories: {
    addDecorator: () => null,
    add: () => null,
    addWithInfo: () => null,
  },
```
*for this particular package, we urge you to analyze all the code. It's simple and small. You should know what's available to you, and how to
add to it if we missed anything.*

In this case, you can see that several Storybook *addons* such as `knobs` and `withReadme` is available to you, as well as the ability to
`addDecorator`. In Storybook land, the real ones will of course be used. In general, the goal is to not obstruct the standard appearance
of your tests, but our assumption is that after you get used to it, you will want some of the Storybook features back.

Here's how an example of how to use it:

```javascript
import React from 'react'
import renderer from 'react-test-renderer'

import readme from '../README.md'
const { color } = storybook.knobs

describe('my test', () => {
  storybook.stories.addDecorator(withReadme(readme))

  it('does something', () => {
    const color = color('my color', 'blue')
    const element = <MyComponent color={color} />
    const tree = renderer.create(element).toJSON()

    expect(tree).toMatchSnapshot()
    return element
  })
})
```

## Storybook Specifications

The Spec tests displayed in Storybook have one interesting difference from your tests when run by the Jest test runner: 

* you will see your potentially multiple expectations
displayed as tests in Storybook. 
* This is because otherwise there would only be one test, since the system is setup to return
one story component per test. You can essentially use the Jest command line tool (or perhaps [Wallaby](http://www.wallabyjs.com))
as your primary test reporter, and then when you use Storybook drill-down even farther. This is especially useful since once a test fails
you typically only see information about the first expectation that failed, whereas in Storybook you will see info about all of them!  


## Help us Improve `storybook-facade.js`

The mocks in `storybook-facade`.js could be improved. We are missing a few `expect` methods from Jest, and the `jest.fn()` mock tool
could be better. Basically they should be copied from the Jest source. When I started this, I copied the initial way the *specifications* addon
did this, but since have decided to make this `jest`-only. So that means we should use the precise tools from Jest. 

Until we replace these things with code from the *Jest* repository, basically here's what you need to do:

```javascript
const expectMethods = [
  'toBeAn',
  'toBeFalsy',
  'toBeFewerThan',
  'toBeMoreThan',
  'toBeTruthy',
  'toContain',
  'toContainKey',
  'addAnotherMethodHere',
  ...

expectReal.extend({
  toMatchSnapshot() {
    expectReal.assert(
      true,
      'expected a snapshot',
      this.actual,
    )
    return this
  },
  addAnotherMethodHere...
})
```


*and this should be improved*:
```javascript
const jest = {
  fn: (implementation) => {
    implementation = implementation || function jestFn() {}

    implementation.mock = {
      calls: [[], [], [], [], []],
      instances: [{}, {}, {}, {}],
      mockClear() {},
      mockReset() {},
      mockImplementation: () => implementation,
      mockImplementationOnce: () => implementation,
      mockReturnThis: () => implementation,
      mockReturnValue: () => implementation,
      mockReturnValueOnce: () => implementation,
    }

    return implementation
  }
```

That all said, when your tests run in Storybook, for most use-cases you should be fine. If you need a specific enhancement, `git clone` it,
make your enhancement, add your fork to `package.json` instead, and make a pull request. It should be a fairly simple process to add what you need 
for a package this basic. 

In addition, it should be fairly simple for all of us together get this up to speed, so that we are not worrying about
what methods are missing in Storybook land. Making this `jest`-only provides us that advantage. Our thinking is that Jest is (or will become) the
*one true way* for React testing. So lets reduce complexity by focusing on it.