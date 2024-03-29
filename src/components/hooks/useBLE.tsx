/* eslint-disable no-bitwise */
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

import {atob, btoa} from 'react-native-quick-base64';

const POKEMON_SERVICE_UUID = 'D78A31FE-E14F-4F6A-A107-790AB0D58F27';
const POKEMON_SERVICE_CHARACTERISTIC = 'EBE6204C-C1EE-4D09-97B8-F77F360F7372';

const bleManager = new BleManager();

type VoidCallback = (result: boolean) => void;

// interface BluetoothLowEnergyApi {
//   requestPermissions(cb: VoidCallback): Promise<void>;
//   scanForPeripherals(): void;
//   connectToDevice: (deviceId: Device) => Promise<void>;
//   disconnectFromDevice: () => void;
//   connectedDevice: Device | null;
//   allDevices: Device[];
//   yourParty: Pokemon[];
//   billsPC: Pokemon[];
//   exchangePokemon(
//     device: Device,
//     index: BigInt,
//     operation: number,
//   ): Promise<void>;
//   exchangeError: BleError | null;
// }

export interface Pokemon {
  opCode: BigInt;
  pokemonIndex: BigInt;
}

export enum POKEMON_STATE {
  TRAINER = 1,
  PC = 2,
}

// const startingParty: Pokemon[] = [
//   {
//     opCode: BigInt(POKEMON_STATE.TRAINER),
//     pokemonIndex: BigInt(151),
//   },
//   {
//     opCode: BigInt(POKEMON_STATE.TRAINER),
//     pokemonIndex: BigInt(150),
//   },
//   {
//     opCode: BigInt(POKEMON_STATE.TRAINER),
//     pokemonIndex: BigInt(149),
//   },
//   {
//     opCode: BigInt(POKEMON_STATE.TRAINER),
//     pokemonIndex: BigInt(145),
//   },
//   {
//     opCode: BigInt(POKEMON_STATE.TRAINER),
//     pokemonIndex: BigInt(143),
//   },
//   {
//     opCode: BigInt(POKEMON_STATE.TRAINER),
//     pokemonIndex: BigInt(130),
//   },
// ];

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [yourParty, setYourParty] = useState<Pokemon[]>();
  const [billsPC, setBillsPc] = useState<Pokemon[]>([]);
  const [exchangeError, setExchangeError] = useState<BleError | null>(null);

  const requestPermissions = async (cb: VoidCallback) => {
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

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex(device => nextDevice.localName === device.localName) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (
        device &&
        (device.name?.includes("Bill's PC") ||
          device.localName?.includes("Bill's PC"))
      ) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      // startStreamingData(deviceConnection);
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

  // const startStreamingData = async (device: Device) => {
  //   if (device) {
  //     device.monitorCharacteristicForService(
  //       POKEMON_SERVICE_UUID,
  //       POKEMON_SERVICE_CHARACTERISTIC,
  //       onPokemonPartyUpdated,
  //     );
  //   } else {
  //     console.log('No Device Connected');
  //   }
  // };

  // Tutorial Methods Start ====

  // const encodeExchangeRequest = (exchangePokemon: Pokemon[]) => {
  //   let rawData = BigInt(0);
  //   let byteArrayOffset = 0;

  //   for (let pokemon of exchangePokemon) {
  //     byteArrayOffset += 8;
  //     const opCode = pokemon.opCode.valueOf() << BigInt(byteArrayOffset);

  //     const pokedexCode =
  //       pokemon.pokemonIndex.valueOf() << BigInt(byteArrayOffset - 8);

  //     const fullCode = opCode | pokedexCode;
  //     rawData = rawData | fullCode;
  //     byteArrayOffset += 2;
  //   }

  //   return rawData;
  // };

  // const exchangePokemon = async (
  //   device: Device,
  //   index: BigInt,
  //   operation: number,
  // ) => {
  //   const allPokemon = [...yourParty, ...billsPC];

  //   allPokemon.sort((a, b) =>
  //     Number(a.pokemonIndex.valueOf() - b.pokemonIndex.valueOf()),
  //   );

  //   const targetIndex = allPokemon.findIndex(poke => {
  //     return poke.pokemonIndex === index;
  //   });

  //   allPokemon[targetIndex].opCode = BigInt(operation);

  //   const request = encodeExchangeRequest(allPokemon);
  //   setExchangeError(null);

  //   try {
  //     await bleManager.writeCharacteristicWithResponseForDevice(
  //       device.id,
  //       POKEMON_SERVICE_UUID,
  //       POKEMON_SERVICE_CHARACTERISTIC,
  //       btoa(`${request}`),
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const extractBit = (target: BigInt, startBit: BigInt, endBit: BigInt) => {
  //   const mask =
  //     ((BigInt(1) << endBit.valueOf()) - BigInt(1)) << startBit.valueOf();

  //   return mask & target.valueOf();
  // };

  // const deserializeData = (data: string) => {
  //   const kPokeIndexLength = 8;
  //   const kOpcodeLength = 2;
  //   const allPokemon: Pokemon[] = [];

  //   let allData = BigInt(data);
  //   let i = 0;

  //   while (i < 60) {
  //     const pokemonIndex =
  //       extractBit(allData, BigInt(i), BigInt(kPokeIndexLength)) >> BigInt(i);

  //     const opCode =
  //       extractBit(
  //         allData,
  //         BigInt(i + kPokeIndexLength),
  //         BigInt(kOpcodeLength),
  //       ) >> BigInt(i + kPokeIndexLength);

  //     allPokemon.push({
  //       opCode,
  //       pokemonIndex,
  //     });

  //     i += 10;
  //   }

  //   return allPokemon;
  // };

  // const onPokemonPartyUpdated = (
  //   error: BleError | null,
  //   characteristic: Characteristic | null,
  // ) => {
  //   const rawData = atob(characteristic?.value ?? '');
  //   const newPokemon = deserializeData(rawData);

  //   if (error) {
  //     setExchangeError(error);
  //     return;
  //   }

  //   const filterPokemon = newPokemon.filter(
  //     pokemon => pokemon.opCode !== BigInt(POKEMON_STATE.PC),
  //   );

  //   const filterPC = newPokemon.filter(
  //     pokemon => pokemon.opCode === BigInt(POKEMON_STATE.PC),
  //   );

  //   setYourParty(filterPokemon);
  //   setBillsPc(filterPC);
  // };

  return {
    // exchangePokemon,
    scanForPeripherals,
    requestPermissions,
    // connectToDevice,
    // allDevices,
    // connectedDevice,
    // disconnectFromDevice,
    // billsPC,
    // yourParty,
    // exchangeError,
  };
}

export default useBLE;
