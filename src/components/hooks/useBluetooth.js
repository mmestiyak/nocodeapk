/* eslint-disable no-bitwise */
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import DeviceInfo from 'react-native-device-info';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState('');
  const [recievedData, setRecievedData] = useState('');

  const requestPermissions = async cb => {
    if (Platform.OS === 'android') {
      const apiLevel = await DeviceInfo.getApiLevel();

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonNeutral: 'Ask Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        cb(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const result = await requestMultiple([
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);

        const isGranted =
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED;

        cb(isGranted);
      }
    } else {
      cb(true);
    }
  };

  const isDuplicateDevice = (devices, nextDevice) =>
    devices.findIndex(device => nextDevice.localName === device.localName) > -1;

  const scanForPeripherals = async () => {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      setAllDevices(prevState => {
        if (!isDuplicateDevice(prevState, ...devices)) {
          return [...prevState, ...devices];
        }
        return prevState;
      });
    } catch (err) {
      console.log(err);
    }
  };
  const onDataReceived = data => {
    console.log(`Received data from device ${data}:`);
    console.log(data);
    setRecievedData(data.data);
    console.log(data.data, 'daa');
    // Process the received data or perform any necessary actions
  };

  const connectToDevice = async device => {
    try {
      // await RNBluetoothClassic.connectToDevice(device.id, );
      // let con = await RNBluetoothClassic.connectToDevice(device.id, {
      //   delimiter: '',
      // });

      // console.log(device);
      const con = await device.connect({
        delimiter: '',
      });
      if (con) {
        setConnectedDevice(device);
        device.onDataReceived(onDataReceived); // Add onDataReceived callback
        console.log('connected');
      }
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = async device => {
    if (device) {
      try {
        await device.disconnect();
      } catch (err) {
        console.log(err);
      } finally {
        setConnectedDevice(null);
      }
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    recievedData,
  };
}

export default useBLE;
