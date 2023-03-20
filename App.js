import Bluetooth from './src/components/Bluetooth';
import React from 'react';

const App = () => {
  return (
    <>
      <Bluetooth />
    </>
  );
  // return (
  //   <NativeBaseProvider>
  //     <Box padding={2}>
  //       <Button onPress={scanForDevices}>hey</Button>
  //     </Box>
  //   </NativeBaseProvider>
  // );
};

export default App;
