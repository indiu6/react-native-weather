import { StatusBar } from 'expo-status-bar';
// <StatusBar style="auto" />
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Loading from './Loading';
import Weather from './Weather';
import * as Location from 'expo-location';
import axios from 'axios';

const WEATHER_API_KEY = 'bfe68bf678b7f62d1f2c3d85887a49e5';

export default class extends React.Component {
  state = {
    isLoading: true,
  };
  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather,
        name,
      },
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${WEATHER_API_KEY}&units=metric`,
    );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp,
      name,
    });
  };
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", 'So sad');
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition, name } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} name={name} />
    );
  }
}

//todo hook converting..

// export default function App() {
//   const [isLoading, setLoading] = useState(true);
//   const [dataSet, setData] = useState({});

//   useEffect(() => {
//     getLoaction();
//   }, []);

//   const getWeather = async (latitude, longitude) => {
//     const {
//       data: {
//         main: { temp },
//         weather,
//         name,
//       },
//     } = await axios.get(
//       `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`,
//     );

//     setLoading(false);
//     setData({
//       condition: weather[0].main,
//       temp,
//       name,
//     });
//   };

//   const getLoaction = async () => {
//     try {
//       // throw Error(); // to test error msg
//       await Location.requestPermissionsAsync();
//       let {
//         coords: { latitude, longitude },
//       } = await Location.getCurrentPositionAsync();

//       getWeather(latitude, longitude);
//     } catch (error) {
//       Alert.alert("Can't find you", 'So sad');
//     }
//   };

//   const { condition, temp, name } = dataSet;

//   return isLoading ? (
//     <Loading />
//   ) : (
//     <Weather temp={Math.round(temp)} condition={condition} name={name} />
//   );
// }
