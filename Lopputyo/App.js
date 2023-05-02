import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Pressable} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';

const API_KEY = '91280b23a810c19d8e8cbccf6d1d40da';

const firebaseConfig = {
  apiKey: "AIzaSyBfSnkOTJi79nQFcSqHhHqqr5JP7-G3V8k",
  authDomain: "lopputyo-22086.firebaseapp.com",
  projectId: "lopputyo-22086",
  storageBucket: "lopputyo-22086.appspot.com",
  messagingSenderId: "21273913550",
  appId: "1:21273913550:web:e0b39d3cdca5f529f0089f",
  measurementId: "G-40DRPYPNMM"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [city, setCity] = useState('');
  const [temp, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [description, setDescription] = useState('');
  const [savedCities, setSavedCities] = useState([]);
  const [icon, setIcon] = useState([]);
  const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
  

  useEffect(() => {
    // Lataa tallennetut kaupungit Firebase-tietokannasta
    const cityRef = ref(database, 'cities');
    onValue(cityRef, snapshot => {
      const cityList = snapshot.val();
      if (cityList) {
        setSavedCities(Object.values(cityList));
      }
    });
  }, []);

  const handleSearch = () => {
    // Hae sääennuste API:sta
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fi&appid=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setTemperature(data.main.temp);
        setHumidity(data.main.humidity);
        setDescription(data.weather[0].description);
        setIcon(data.weather[0].icon);
      })
      .catch(error => console.error(error));
  };

  const handleSaveCity = () => {
    // Tallenna kaupunki Firebase-tietokantaan
    push(ref(database, 'cities'), city);
    setCity('');
  };

  const handleSavedCityPress = (cityName) => {
    // Hae tallennetun kaupungin sääennuste API:sta
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=fi&appid=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setTemperature(data.main.temp);
        setHumidity(data.main.humidity);
        setDescription(data.weather[0].description);
        setIcon(data.weather[0].icon);
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headertext}>Paikallinen sää</Text>
      <Text style={styles.text}>{city}</Text>
      <Image style={styles.image}source={{url: iconUrl}} />
      <Text>Lämpötila: {temp} °C</Text>
      <Text>Ilmankosteus: {humidity}</Text>
      <Text>Säätila: {description}</Text>
      
      

      <View style={styles.inputContainer}>
<TextInput
  style={styles.input}
  placeholder="Syötä kaupunki"
  onChangeText={setCity}
  value={city}
/>
<Button title="Hae" onPress={handleSearch} />
<Button style={styles.button}title="Tallenna" onPress={handleSaveCity}/>
</View>


      <Text style={styles.text}>Valitse kaupunki:</Text>
      {savedCities.map(savedCity => (
        <TouchableOpacity style={styles.text} key={savedCity} onPress={() => handleSavedCityPress(savedCity)}>
          <Text style={styles.savedCity}>{savedCity}</Text>
        </TouchableOpacity>
      ))}
    </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      marginTop: 100,
      marginBottom: 100,
      flex: 1,
      padding: 20,
      alignContent: 'center'
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 50,
    },
    input: {
      marginTop: 20,
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      marginRight: 10
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44
    },
    buttonContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: 10
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'black',
      alignSelf: 'center'
    },
    headertext: {
      margin: 20,
      fontSize: 20,
      alignSelf:'center',
      fontWeight: 'bold',
    },
    image: {
      alignSelf: 'center',
      width: 100,
      height: 100,
    }
    
  });