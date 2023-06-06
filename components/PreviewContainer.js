import React from 'react';
import {Box, Pressable} from 'native-base';

const PreviewContainer = ({
  component,
  index,
  type,
  isBoxWrapped,
  wrapPressable = false,
}) => {
  const propsElement = {
    ...component.props,
    type: component.id,
  };
  const children = React.createElement(type, propsElement);

  if (isBoxWrapped) {
    const boxProps = {};

    return <Box {...boxProps}>{children}</Box>;
  }

  if (wrapPressable) {
    return <Pressable>{children}</Pressable>;
  }

  return children;
};

export default PreviewContainer;
