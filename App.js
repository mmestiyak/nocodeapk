import React from 'react';
import {NativeBaseProvider, Box, Button} from 'native-base';
import useBLE from './src/components/hooks/useBLE';
import Screen1 from './src/components/Screen1';

const App = () => {
  const {
    yourParty,
    connectedDevice,
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    allDevices,
    billsPC,
    exchangePokemon,
  } = useBLE();

  const scanForDevices = () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };

  return (
    <NativeBaseProvider>
		<Box padding={2}>
			<Screen1/>
		</Box>
	</NativeBaseProvider>
  )

};

export default App;
