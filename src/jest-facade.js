import renderer from 'react-test-renderer';
import { isElement } from 'react-dom/test-utils';

const itReal = it;
const isPromise = val => typeof val === 'object' && val.next;

it = (name, test) => {
  //  console.log(isElement(test));

  if (isElement(test)) {
    itReal(name, () => {
      const tree = renderer.create(test).toJSON();

      expect(tree).toMatchSnapshot();

      if (process.env.STORYBOOK_GIT_BRANCH) {
        return test; // will become a story in Storybook, yay!
      }
    });
  } else {
    if (typeof test !== 'function') {
      return;
    }

    itReal(name, () => {
      // eslint-disable-line consistent-return
      const ret = test();

      // storybook `it` allows for returning the story component,
      // but undefined or promises is expected in jest
      if (isPromise(ret)) {
        return ret;
      }
    });
  }
};

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
};

