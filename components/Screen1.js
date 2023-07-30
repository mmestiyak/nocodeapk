import React, {useState} from 'react';
import ComponentPreview from './ComponentPreview';
import produce from 'immer';

const Screen1 = () => {
  const [components, updateComponents] = useState(
    parseWithFunctions(
      JSON.stringify({
        root: {
          id: 'root',
          parent: 'root',
          type: 'Document',
          children: [
            'comp-LBQIDOJNVR8EC',
            'comp-LBQIDPWFJC665',
            'comp-LBQIEGENY20TF',
            'comp-LBQIEJ6MCI0J8',
          ],
          props: {},
          name: '',
        },
        'comp-LBQIDOJNVR8EC': {
          id: 'comp-LBQIDOJNVR8EC',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'Button',
            size: 'md',
            width: 20,
            colorScheme: 'primary',
            variant: 'solid',
            onPress:
              "(function anonymous(\n) {\nreturn  (function a() {\n  \t\tupdateComponents(\t updateComponentProps(components,{\n  \t\tid: 'comp-LBQIDPWFJC665',\n  \t\tname: 'children',\n  \t\tvalue: 'moran, hey',\n  \t}))\n  \t\n  \t})()\n})",
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LBQIDPWFJC665': {
          id: 'comp-LBQIDPWFJC665',
          type: 'Button',
          name: 'Button 2',
          children: [],
          props: {
            children: 'Button',
            size: 'md',
            width: 20,
            colorScheme: 'primary',
            variant: 'solid',
            onPress:
              "(function anonymous(\n) {\nreturn  (function a() {\n  \t\tupdateComponents(\t updateComponentProps(components,{\n  \t\tid: 'comp-LBQIDOJNVR8EC',\n  \t\tname: 'children',\n  \t\tvalue: 'aaa',\n  \t}))\n  \t\n  \t})()\n})",
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LBQIEGENY20TF': {
          id: 'comp-LBQIEGENY20TF',
          type: 'Text',
          name: 'Text 1',
          children: [],
          props: {children: 'Write Here'},
          parent: 'root',
          rootParentType: 'Text',
        },
        'comp-LBQIEJ6MCI0J8': {
          id: 'comp-LBQIEJ6MCI0J8',
          type: 'Spinner',
          name: 'Spinner 1',
          children: [],
          props: {color: '#be185d'},
          parent: 'root',
          rootParentType: 'Spinner',
        },
      }),
    ),
  );
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
  return (
    <>
      {components.root.children?.map((name, index) => (
        <ComponentPreview
          key={name}
          index={index}
          component={components[name]}
          componentName={name}
        />
      ))}
    </>
  );
};

export default Screen1;
