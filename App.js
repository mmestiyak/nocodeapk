import React from 'react'
import { NativeBaseProvider, Button, Text } from 'native-base'

const App = () => (
  <NativeBaseProvider>
    <Button size="md" width={20} colorScheme="darkBlue" variant="solid">
      Button
    </Button>
    <Text>Write Here</Text>
  </NativeBaseProvider>
)

export default App