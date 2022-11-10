import React from 'react'
import { NativeBaseProvider, Box, Button } from 'native-base'

const App = () => (
  <NativeBaseProvider>
    <Box width="100%" padding={4} bg="primary" height="auto" minHeight="50px" />
    <Button size="md" width={20} colorScheme="primary" variant="solid">
      Buttonss
    </Button>
  </NativeBaseProvider>
)


export default App