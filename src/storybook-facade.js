import React from 'react'

import { storiesOf, action, linkTo } from '@kadira/storybook'
import withReadme from 'storybook-readme/with-readme'
import * as knobs from '@kadira/storybook-addon-knobs'

import {
  specs,
  beforeEach,
  afterEach,
  before, // not supported in jest, use beforeAll
  after,  // not supported in jest, use afterAll
  xit,
  xdescribe,
  describe as describeReal,
  it as itReal,
} from 'storybook-addon-specifications'

import expectReal from 'expect'


const storybook = {
  stories: {},
  action,
  linkTo,
  withReadme,
  knobs,
}

const describe = (name, tests) => {
  storybook.stories = storiesOf(name, module)
  tests()
}

const it = (name, test) => {
  const stories = storybook.stories
  const add = stories.addWithInfo || stories.add

  add.call(stories, name, () => {
    let story

    specs(() => describeReal(name, () => {
      story = test()
    }))

    return story || <div>NO STORY AVAILABLE FOR THIS TEST</div>
  })
}


const expect = (received) => {
  const callExpect = (method, ...expectedArgs) => {
    const expectedValue = expectedArgs[0] || ''
    const receivedFormatted = formatReceived(received, method)
    const name = `expects ${receivedFormatted} ${method} ${expectedValue}`

    itReal(name, () => {
      expectReal(received)[method](...expectedArgs)
    })
  }

  return expectMethods.reduce((expectObject, method) => {
    expectObject[method] = callExpect.bind(null, method)
    return expectObject
  }, {})
}

const formatReceived = (received, method) => {
  if (method === 'toMatchSnapshot') {
    return 'component or value'
  }
  else if (typeof received === 'function') {
    return received.toString()
  }
  else if (typeof received === 'object') {
    return JSON.stringify(received, null, 1)
  }

  return received
}


const expectMethods = [
  'toBeAn',
  'toBeFalsy',
  'toBeFewerThan',
  'toBeMoreThan',
  'toBeTruthy',
  'toContain',
  'toContainKey',
  'toContainKeys',
  'toNotBeAn',
  'toNotContain',
  'toNotContainKey',
  'toNotContainKeys',
  'toNotInclude',
  'toNotIncludeKey',
  'toNotIncludeKeys',
  'withArgs',
  'withContext',
  'toBe',
  'toBeA',
  'toBeGreaterThan',
  'toBeGreaterThanOrEqualTo',
  'toBeLessThan',
  'toBeLessThanOrEqualTo',
  'toEqual',
  'toExclude',
  'toExcludeKey',
  'toExcludeKeys',
  'toExist',
  'toHaveBeenCalled',
  'toHaveBeenCalledWith',
  'toInclude',
  'toIncludeKey',
  'toIncludeKeys',
  'toMatch',
  'toNotBe',
  'toNotBeA',
  'toNotEqual',
  'toNotExist',
  'toNotHaveBeenCalled',
  'toNotMatch',
  'toNotThrow',
  'toThrow',
  'toMatchSnapshot',
  'toBeCalled',
]

expectReal.extend({
  toMatchSnapshot() {
    expectReal.assert(
      true,
      'expected a snapshot',
      this.actual,
    )
    return this
  },
  toBeCalled() {
    expectReal.assert(
      true,
      'expected to be called',
      this.actual,
    )
    return this
  },
})


// this should actually perform the `only` function at some point
const fdescribe = (name, tests) => describe(name, tests)
const fit = (name, test) => it(name, test)
const beforeAll = before
const afterAll = after
const jest = {
  fn: (implementation) => function jestFn() {}, // eslint-disable-line
  clearAllTimers() {},
  disableAutomock() {},
  enableAutomock() {},
  isMockFunction(fn) {}, // eslint-disable-line
  genMockFromModule(moduleName) {}, // eslint-disable-line
  mock(moduleName, factory, options) {}, // eslint-disable-line
  clearAllMocks() {},
  resetAllMocks() {},
  resetModules() {},
  runAllTicks() {},
  runAllTimers() {},
  runTimersToTime(msToRun) {}, // eslint-disable-line
  runOnlyPendingTimers() {}, // eslint-disable-line
  setMock(moduleName, moduleExports) {}, // eslint-disable-line
  unmock(moduleName) {}, // eslint-disable-line
  useFakeTimers() {},
  useRealTimers() {},
  spyOn(object, methodName) {}, // eslint-disable-line
}

window.storybook = storybook
window.jest = jest
window.expect = expect
window.describe = describe
window.xdescribe = xdescribe
window.fdescribe = fdescribe
window.it = it
window.xit = xit
window.fit = fit
window.beforeEach = beforeEach
window.afterEach = afterEach
window.beforeAll = beforeAll
window.afterAll = afterAll
