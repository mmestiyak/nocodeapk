import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import DeviceModal from './DeviceModal';
import useBluetooth from './hooks/useBluetooth';

const Bluetooth = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      {connectedDevice ? (
        <>
          <Text style={styles.heartRateTitleText}>Device connected</Text>
          <Pressable style={styles.ctaButton} onPress={disconnectFromDevice}>
            <Text style={styles.connectButton}>disconnect</Text>
          </Pressable>
          <Pressable
            style={styles.ctaButton}
            onPress={async () => await connectedDevice.write('1')}>
            <Text style={styles.connectButton}>on</Text>
          </Pressable>
          <Pressable
            style={styles.ctaButton}
            onPress={async () => await connectedDevice.write('0')}>
            <Text style={styles.connectButton}>off</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.connectContainer}>
          <View style={styles.pcConnectTextContainer}>
            <Text style={styles.blankTextTitle}>Connect Device</Text>
          </View>
          <Pressable style={styles.ctaButton} onPress={showModal}>
            <Text style={styles.connectButton}>Connect</Text>
          </Pressable>
        </View>
      )}
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  heartRateTitleText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    color: 'black',
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: 'purple',
    height: 48,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    width: '75%',
    marginLeft: 12,
  },
  yourParty: {
    marginTop: 10,
    marginBottom: 50,
  },
  billsPc: {
    marginVertical: 10,
    height: '30%',
  },
  pokemonAvatar: {
    height: '80%',
    width: 50,
    marginLeft: 5,
  },
  pokemonButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blankTextTitle: {
    marginHorizontal: 22,
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  connectButton: {
    color: 'white',
    textAlign: 'center',
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 9,
  },
  connectContainer: {
    flex: 1,
  },
  pcConnectTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Bluetooth;
