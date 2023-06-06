import React from 'react'
import Screen1 from './src/components/Screen1'
import { NativeBaseProvider, Box} from 'native-base';

const App = () => (
  <NativeBaseProvider>
		<Box padding={2}>
			<Screen1/>
		</Box>
	</NativeBaseProvider>
)

export default App