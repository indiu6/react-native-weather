import { StatusBar } from 'expo-status-bar';
// <StatusBar style="auto" />
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Loading from './Loading';
import Weather from './Weather';
import * as Location from 'expo-location';
import axios from 'axios';

const WEATHER_API_KEY = 'bfe68bf678b7f62d1f2c3d85887a49e5';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [dataSet, setData] = useState({
    temp: null,
    condition: null,
    name: null,
  });

  useEffect(() => {
    getLoaction();
  }, []);

  const getLoaction = async () => {
    try {
      // throw Error(); // to test error msg
      await Location.requestPermissionsAsync();
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      // console.log(latitude, longitude);

      getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you", 'So sad');
    }
  };

  const getWeather = async (latitude, longitude) => {
    const { data } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`,
    );
    console.log(data);

    let {
      main: { temp },
      weather,
      name,
    } = data;
    // console.log(weather[0].main);

    setLoading(false);
    setData({
      temp: temp,
      condition: weather[0].main,
      name: name,
    });
    // console.log(dataSet.temp);
    // console.log(dataSet.condition);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Weather
      temp={Math.round(dataSet.temp)}
      condition={dataSet.condition}
      name={dataSet.name}
    />
  );
}
