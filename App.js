import { StatusBar } from 'expo-status-bar';
import {Button, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ResearchBar from "./src/ResearchBar";
import {useEffect, useState} from "react";
import * as Sqlite from 'expo-sqlite';
import dbInit from './src/dbInit';
import LoadData from './src/LoadData';

const { width } = Dimensions.get("window");
const db = Sqlite.openDatabaseSync('PlantFinder.sqlite');

export default function App() {
  useEffect(() => {
    dbInit(db);
  }, []);

  const [data, setData] = useState([]);

  return (
    <View style={styles.container}>
      <ResearchBar setData={setData} db={db} />
      <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
      >
        {data.map((item, index) => (
            <View key={index} style={[styles.slide, { backgroundColor: index % 2 ? "#0e4404" : "#047c49" }]}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subTitle}>Symptômes :</Text>
              <Text style={styles.content}>{item.symptoms}</Text>
              <Text style={styles.subTitle}>Contre-indication :</Text>
              <Text style={styles.content}>{item.contradication}</Text>
              <Text style={styles.subTitle}>Parties :</Text>
              <Text style={styles.content}>{item.parts}</Text>
            </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.loadData}  onPress={async () => {
        await LoadData(db);
      }}>
        <Text style={styles.loadDataText}>Charger des données</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b5f382',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: width * 0.98,
    height: 680,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
  content: {
    color: "#fff",
    fontSize: 20,
    paddingHorizontal: 20,
  },
  loadData: {
    width: width * 0.9,
    backgroundColor: '#734306',
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    marginBottom: 20
  },
  loadDataText: {
    color: "#fff",
    fontSize: 20,
  }
});
