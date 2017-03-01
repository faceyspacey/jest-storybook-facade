const itReal = it

it = (name, test) => {
  itReal(name, () => { // eslint-disable-line consistent-return
    const ret = test()

    // storybook `it` allows for returning the story component,
    // but undefined or promises is expected in jest
    if (isPromise(ret)) {
      return ret
    }
  })
}

const isPromise = val =>
  typeof val === 'object' && val.next


global.storybook = {
  action: name => () => console.log('action', name),
  linkTo: (component, story) => () => console.log('linkTo', component, story),
  withReadme: readme => null, // eslint-disable-line no-unused-vars
  knobs: {
    text: (label, value) => value,
    boolean: (label, value) => value,
    number: (label, value, options) => value, // eslint-disable-line no-unused-vars
    color: (label, value) => value,
    object: (label, value) => value,
    array: (label, value, separator = ',') => value, // eslint-disable-line no-unused-vars
    select: (label, options, value) => value,
    date: (label, value) => value,
  },
  stories: {
    addDecorator: () => null,
    add: () => null,
    addWithInfo: () => null,
  },
}
