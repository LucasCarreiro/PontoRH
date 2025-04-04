import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';
import { saveData } from '../database/models/Point';
import TimePickerModal from '../components/TimePickerModal';

const ClockInScreen = ({ route }) => {
  const { email } = route.params;
  const [location, setLocation] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const getLocation = async () => {
    try {
      const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      
      if (status === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position.coords);
            getMapImage(position.coords.latitude, position.coords.longitude);
          },
          error => {
            console.log(error.code, error.message);
            Alert.alert('Erro', 'Não foi possível obter a localização');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert(
          'Permissão necessária',
          'O app precisa de permissão de localização',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getMapImage = async (lat, lng) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get_map_image?latitude=${lat}&longitude=${lng}&zoom=15&size=600x400&markers=color:red|label:S|${lat},${lng}&maptype=roadmap`
      );
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        setImageUri(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error fetching map image:', error);
      Alert.alert('Erro', 'Não foi possível obter a imagem do mapa');
    }
  };

  const handleClockIn = async (time) => {
    try {
      await saveData(time, email);
      Alert.alert('Sucesso', 'Ponto registrado com sucesso');
    } catch (error) {
      console.error('Error saving point:', error);
      Alert.alert('Erro', 'Não foi possível registrar o ponto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bata seu ponto</Text>
      
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.mapImage} />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Obter Localização" onPress={getLocation} />
        <Button
          title="Registrar Ponto"
          onPress={() => setShowTimePicker(true)}
        />
      </View>

      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onConfirm={handleClockIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mapImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default ClockInScreen;
