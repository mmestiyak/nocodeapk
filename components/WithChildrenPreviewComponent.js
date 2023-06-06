import React from 'react';

import {Pressable} from 'native-base';
import ComponentPreview from './ComponentPreview';

const WithChildrenPreviewContainer = ({
  component,
  index,
  type,
  enableVisualHelper = true,
  isBoxWrapped,
  ...forwardedProps
}) => {
  const propsElement = {
    ...component.props,
    ...forwardedProps,
    position: 'relative',
    height: 'auto',
    minHeight: '50px',
    overflow: 'hidden',
    flexDirection: 'row',
  };

  const children = React.createElement(
    type,
    propsElement,
    component?.children?.map(key => (
      <ComponentPreview
        index={index}
        isMovedFromBox={true}
        key={key}
        componentName={key}
      />
    )),
  );

  if (isBoxWrapped) {
    const boxProps = {
      display: 'inline',
    };

    return <Pressable {...boxProps}>{children}</Pressable>;
  }

  return <Pressable>{children}</Pressable>;
};

export default WithChildrenPreviewContainer;
