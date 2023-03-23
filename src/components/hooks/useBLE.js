/* eslint-disable no-bitwise */
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import DeviceInfo from 'react-native-device-info';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import { atob } from 'react-native-quick-base64';

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState();
  const serviceuuid = '00001811-0000-1000-8000-00805f9b34fb';
  const uuid = '00002a05-0000-1000-8000-00805f9b34fb';

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

  function getServicesAndCharacteristics(device) {
    return new Promise((resolve, reject) => {
      device.services().then(services => {
        const characteristics = [];

        services.forEach((service, i) => {
          service.characteristics().then(c => {
            characteristics.push(c);

            if (i === services.length - 1) {
              const temp = characteristics.reduce((acc, current) => {
                return [...acc, ...current];
              }, []);
              const dialog = temp.find(
                characteristic => characteristic.isWritableWithoutResponse,
              );
              if (!dialog) {
                reject('No writable characteristic');
              }
              resolve(dialog);
            }
          });
        });
      });
    });
  }

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (true) {
        setAllDevices(prevState => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  async function readData(device) {
    const services = await device.services();
    console.log('Services:', services);
    const characteristics = await services[2].characteristics();
    console.log('Characteristics:', characteristics);
    characteristics[0].monitor((err, update) => {
      if (err) {
        console.log(`characteristic error: ${err}`);
        console.log(JSON.stringify(err));
      } else {
        console.log('ss')
        console.log('Is Characteristics Readable:', update.isReadable);
        // console.log('Heart Rate Data:', atob(update.value));
        // // const readCharacteristic = await device.readCharacteristicForService(userDataServiceUUID,
        //  heightCharacteristicUUID); // assuming the device is already connected
        // // var data = new Uint16Array(base64.decode(update.value));

        // const heartRateData = Buffer.from(update.value, 'base64').readUInt16LE(0);
        // console.log("Heart Beats:",heartRateData);
      }
    });
  }

  const connectToDevice = async device => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      const services = await deviceConnection.services();
      // let characteristicss = [];
      // for await (const service of services) {
      //   const characteristics = await service.characteristics();
      //   for await (const characteristic of characteristics) {
      //     characteristicss.push(characteristic);
      //   }
      // }
      // console.log(characteristicss, 'ss');
      readData(device);

      bleManager.stopDeviceScan();
      console.log(device);
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  const startStreamingData = async device => {
    if (device) {
      console.log(device);
      device.monitorCharacteristicForService(
        '11964219-3381-45b9-b239-692f17ecb9fd',
        '31983d37-32cd-4da8-9006-d2b4d8be31e8',
        (err, char) => {
          // const decoded = atob(char.value);

          console.log(decoded, 'ss');
        },
      );
    } else {
      console.log('No Device Connected');
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
  };
}

export default useBLE;
