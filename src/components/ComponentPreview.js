import * as NativeBase from 'native-base';
import React from 'react';
import PreviewContainer from './PreviewContainer';
import WithChildrenPreviewContainer from './WithChildrenPreviewComponent';

const ComponentPreview = ({
  componentName,
  index,
  component,
  state,
  ...forwardedProps
}) => {
  if (!component) {
    console.error(
      `ComponentPreview unavailable for component ${componentName}`,
    );
  }
  const type = (component && component.type) || null;
  const simpleComponents = ['Button', 'Image', 'Text', 'Heading', 'Radio'];
  const componentsThatNeedPressable = [
    'Spinner',
    'Checkbox',
    'TextArea',
    'Badge',
    'Switch',
    'Input',
  ];

  const componentsWithChildren = ['Box'];
  if (simpleComponents.includes(type)) {
    return (
      <PreviewContainer
        index={index}
        component={component}
        state={state}
        type={NativeBase[type]}
        {...forwardedProps}
      />
    );
  }
  if (componentsThatNeedPressable.includes(type)) {
    return (
      <PreviewContainer
        index={index}
        component={component}
        wrapPressable
        type={NativeBase[type]}
        {...forwardedProps}
      />
    );
  }
  if (componentsWithChildren.includes(type)) {
    return (
      <WithChildrenPreviewContainer
        index={index}
        component={component}
        type={NativeBase[type]}
        {...forwardedProps}
      />
    );
  }
  return <></>;
};

export default ComponentPreview;
