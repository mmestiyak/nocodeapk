import React, {useState} from 'react';
import ComponentPreview from './ComponentPreview';
import produce from 'immer';

const Screen1 = () => {
  function updateComponentProps(state, payload) {
    return produce(state, draftState => {
      draftState.components[payload.id].props[payload.name] = payload.value;
    });
  }

  const [components, updateComponents] = useState({
    components: {
      root: {
        id: 'root',
        parent: 'root',
        type: 'Document',
        children: ['comp-LBN5K8JFFWLJS', 'comp-LBN4P5EA73KQH'],
        props: {},
        name: '',
      },
      'comp-LBN4P5EA73KQH': {
        id: 'comp-LBN4P5EA73KQH',
        type: 'Button',
        name: 'Button 1',
        children: [],
        props: {
          children: 'click',
          size: 'md',
          width: 20,
          colorScheme: 'primary',
          variant: 'solid',
          onPress: function () {
            updateComponents(
              updateComponentProps(components, {
                id: 'comp-LBN5K8JFFWLJS',
                name: 'children',
                value: 'bonga',
              }),
            );
          },
        },
        parent: 'root',
        rootParentType: 'Button',
      },
      'comp-LBN5K8JFFWLJS': {
        id: 'comp-LBN5K8JFFWLJS',
        type: 'Text',
        name: 'Text 1',
        children: [],
        props: {
          children: 'Helooo there',
        },
        parent: 'root',
        rootParentType: 'Text',
      },
    },
    selectedId: 'comp-LBN4P5EA73KQH',
    hoveredId: 'comp-LBN4P5EA73KQH',
  });
  return (
    <>
      {components.components.root.children?.map((name, index) => (
        <ComponentPreview
          key={name}
          index={index}
          component={components.components[name]}
          componentName={name}
        />
      ))}
    </>
  );
};

export default Screen1;
