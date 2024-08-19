import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const API_KEY = 'fbe374eedba2ffc96ee7c75fa6fb57b8';

  useEffect(() => {
    const obterLocalizacao = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErro('Permissão para acessar a localização foi negada.');
          setLoading(false);
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = coords;

        const resposta = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${API_KEY}`
        );
        setClima(resposta.data);
      } catch (error) {
        setErro('Erro ao buscar dados climáticos.');
        Alert.alert('Erro', 'Não foi possível obter os dados climáticos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    obterLocalizacao();
  }, []);

  if (loading) {
    return (
      <View style={estilos.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.textoErro}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      {clima && (
        <>
          <Text style={estilos.texto}>Temperatura: {clima.main.temp}°C</Text>
          <Text style={estilos.texto}>Umidade: {clima.main.humidity}%</Text>
          <Image
            style={estilos.iconeClima}
            source={{
              uri: `https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`,
            }}
          />
          <Text style={estilos.texto}>{clima.weather[0].description}</Text>
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  texto: {
    fontSize: 20,
    marginBottom: 10,
  },
  iconeClima: {
    width: 100,
    height: 100,
  },
  textoErro: {
    fontSize: 18,
    color: 'red',
  },
});
