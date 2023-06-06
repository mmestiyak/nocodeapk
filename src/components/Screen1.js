import React, {useState} from 'react';
import ComponentPreview from './ComponentPreview';
import produce from 'immer';
import DeviceModal from './DeviceModal';
import useBluetooth from './hooks/useBluetooth';

const Screen1 = () => {
  const {
    connectedDevice,
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    allDevices,
    disconnectFromDevice,
  } = useBluetooth();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const showModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };
  const scanForDevices = () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };

  console.log(disconnectFromDevice, showModal);

  function parseWithFunctions(obj) {
    return JSON.parse(obj, (k, v) => {
      if (typeof v === 'string' && v.indexOf('function') >= 0) {
        return eval(v);
      }
      return v;
    });
  }

  function stringifyWithFunctions(object: any) {
    return JSON.stringify(object, (key, val) => {
      if (typeof val === 'function') {
        return `(${val})`; // make it a string, surround it by parenthesis to ensure we can revive it as an anonymous function
      }
      return val;
    });
  }

  function updateComponentProps(state, payload) {
    return produce(state, draftState => {
      draftState[payload.id].props[payload.name] = payload.value;
    });
  }

  const [components, updateComponents] = useState(
    parseWithFunctions(
      stringifyWithFunctions({
        root: {
          id: 'root',
          parent: 'root',
          type: 'Document',
          children: [
            'comp-LGOTRBJEZ42PJ',
            'comp-LGOTRG054HBB8',
            'comp-LGOTRN2PXJ5ZC',
            'comp-LGOTRWYOUZI9B',
            'comp-LGOTS1MPN8B16',
            'comp-LGOTSCNCVEH26',
            'comp-LGOTSGGX3FFW4',
            'comp-LGOTSOAB611TN',
          ],
          props: {},
          name: '',
        },
        nonVisible: {
          id: 'nonvisible',
          parent: 'nonvisible',
          type: 'nonvisible',
          children: ['comp-LGOTSX2WXK5ID'],
          name: '',
          props: {},
        },
        'comp-LGOTRBJEZ42PJ': {
          id: 'comp-LGOTRBJEZ42PJ',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'connect',
            size: 'md',
            width: 20,
            colorScheme: 'primary',
            variant: 'solid',
            isDisabled: false,
            onPress: '(function anonymous(\n) {\n  showModal()\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LGOTRG054HBB8': {
          id: 'comp-LGOTRG054HBB8',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'disconnect',
            size: 'md',
            width: 20,
            colorScheme: 'primary',
            variant: 'solid',
            isDisabled: false,
            onPress:
              '(function anonymous(\n) {\n  disconnectFromDevice(this.connectedDevice)\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LGOTRN2PXJ5ZC': {
          id: 'comp-LGOTRN2PXJ5ZC',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'light on',
            size: 'md',
            width: 20,
            colorScheme: 'violet',
            variant: 'solid',
            isDisabled: false,
            onPress:
              '(function anonymous(\n) {\n  (async() => await this.connectedDevice.write(\'turn on light\',"utf-8"))()\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LGOTRWYOUZI9B': {
          id: 'comp-LGOTRWYOUZI9B',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'light off',
            size: 'md',
            width: 20,
            colorScheme: 'violet',
            variant: 'solid',
            isDisabled: false,
            onPress:
              '(function anonymous(\n) {\n  (async() => await this.connectedDevice.write(\'turn off light\',"utf-8"))()\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LGOTS1MPN8B16': {
          id: 'comp-LGOTS1MPN8B16',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'fan on',
            size: 'md',
            width: 20,
            colorScheme: 'warning',
            variant: 'solid',
            isDisabled: false,
            onPress:
              '(function anonymous(\n) {\n  (async() => await this.connectedDevice.write(\'turn on fan\',"utf-8"))()\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LGOTSCNCVEH26': {
          id: 'comp-LGOTSCNCVEH26',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'fan off',
            size: 'md',
            width: 20,
            colorScheme: 'warning',
            variant: 'solid',
            isDisabled: false,
            onPress:
              '(function anonymous(\n) {\n  (async() => await this.connectedDevice.write(\'turn off fan\',"utf-8"))()\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LGOTSGGX3FFW4': {
          id: 'comp-LGOTSGGX3FFW4',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'turn all',
            size: 'md',
            width: 20,
            colorScheme: 'yellow',
            variant: 'solid',
            isDisabled: false,
            onPress:
              '(function anonymous(\n) {\n  (async() => await this.connectedDevice.write(\'turn on all\',"utf-8"))()\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LGOTSOAB611TN': {
          id: 'comp-LGOTSOAB611TN',
          type: 'Button',
          name: 'Button 1',
          children: [],
          props: {
            children: 'turn off all',
            size: 'md',
            width: 20,
            colorScheme: 'trueGray',
            variant: 'solid',
            isDisabled: false,
            onPress:
              '(function anonymous(\n) {\n  (async() => await this.connectedDevice.write(\'turn off all\',"utf-8"))()\n})',
          },
          parent: 'root',
          rootParentType: 'Button',
        },
        'comp-LGOTSX2WXK5ID': {
          id: 'comp-LGOTSX2WXK5ID',
          type: 'Bluetooth',
          name: 'Bluetooth 1',
          children: [],
          props: {},
          parent: 'nonVisible',
          rootParentType: 'Bluetooth',
        },
      }),
    ),
  );
  console.log(updateComponentProps); // don't remove it
  return (
    <>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
      {components.root.children?.map((name, index) => (
        <ComponentPreview
          key={name}
          index={index}
          state={{connectedDevice}}
          component={components[name]}
          componentName={name}
        />
      ))}
    </>
  );
};

export default Screen1;
