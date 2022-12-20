import React, {useState} from 'react';
import ComponentPreview from './ComponentPreview';
import produce from 'immer';
import {Button, Text} from 'native-base';

const Screen1 = () => {
  function parseWithFunctions(obj) {
    return JSON.parse(obj, (k, v) => {
      if (typeof v === 'string' && v.indexOf('function') >= 0) {
        return eval(v);
      }
      return v;
    });
  }
  function updateComponentProps(state, payload) {
    return produce(state, draftState => {
      draftState[payload.id].props[payload.name] = payload.value;
    });
  }

  function stringifyWithFunctions(object: any) {
    return JSON.stringify(object, (key, val) => {
      if (typeof val === 'function') {
        return `(${val})`; // make it a string, surround it by parenthesis to ensure we can revive it as an anonymous function
      }
      return val;
    });
  }
  const [components, updateComponents] = useState(
    parseWithFunctions(
      stringifyWithFunctions({
        root: {
          id: 'root',
          parent: 'root',
          type: 'Document',
          children: [
            'comp-LBVNS3KIEIB73',
            'comp-LBVNS7JAPCTRO',
            'comp-LBVNSAFRALTC8',
          ],
          props: {},
          name: '',
        },
        'comp-LBVNS3KIEIB73': {
          id: 'comp-LBVNS3KIEIB73',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'Button',
            size: 'md',
            width: 20,
            colorScheme: 'yellow',
            variant: 'solid',
            onPress:
              '(function anonymous(\n) {\nreturn   (function a() {\n \t\tupdateComponents(prev => updateComponentProps(prev, {id: "comp-LBVNS7JAPCTRO", name: "children", value: "TEXT"} ))\n  \t\n  \t})()\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LBVNS7JAPCTRO': {
          id: 'comp-LBVNS7JAPCTRO',
          type: 'Text',
          name: 'Text 1',
          children: [],
          props: {children: 'Write Here'},
          parent: 'root',
          rootParentType: 'Text',
        },
        'comp-LBVNSAFRALTC8': {
          id: 'comp-LBVNSAFRALTC8',
          type: 'Button',
          name: 'Button 2',
          children: [],
          props: {
            children: 'Button',
            size: 'md',
            width: 20,
            colorScheme: 'error',
            variant: 'solid',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
      }),
    ),
  );
  if (Object.keys(components).length) {
    console.log(
      updateComponentProps(components, {
        id: 'comp-LBVNS7JAPCTRO',
        name: 'children',
        value: 'ss',
      }),
      'sukka',
    );
  }
  return (
    <>
      {components.root.children?.map((name, index) => (
        <ComponentPreview
          key={name}
          index={index}
          component={parseWithFunctions(
            stringifyWithFunctions(components[name]),
          )}
          componentName={name}
        />
      ))}
    </>
  );
};

export default Screen1;
