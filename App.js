import { StatusBar } from 'expo-status-bar';
import {Button, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ResearchBar from "./src/ResearchBar";
import React, {useEffect, useState} from "react";
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
  const [visible, setVisible] = useState(false);

  return (
      <View style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Chargement des données...</Text>
              <Text>Veuillez patientez...</Text>
            </View>
          </View>
        </Modal>
        <ResearchBar setData={setData} db={db}/>
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={true}
        >
          {data.map((item, index) => (
              <View key={index} style={[styles.slide, {backgroundColor: index % 3 === 0 ? "#0e4404" : index % 3 === 1 ? "#047c49" : "#88421d"} ]}>
                <Text style={styles.title}>{item.name.replace("\\dqu", '"').replace("\\qu", "'")}</Text>
                <Text style={styles.subTitle}>Symptômes :</Text>
                <Text style={styles.content}>{item.symptoms.replace("\\dqu", '"').replace("\\qu", "'")}</Text>
                <Text style={styles.subTitle}>Contre-indication :</Text>
                <Text style={styles.content}>{item.contradication.replace("\\dqu", '"').replace("\\qu", "'")}</Text>
                <Text style={styles.subTitle}>Parties utilisées:</Text>
                <Text style={styles.content}>{item.parts.replace("\\dqu", '"').replace("\\qu", "'")}</Text>
              </View>
          ))}
        </ScrollView>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.loadData} onPress={async () => {
            setData([]);
            setVisible(true);
            await LoadData(db);
            setVisible(false);
          }}>
            <Text style={styles.loadDataText}>Charger des données</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reset} onPress={async () => {
            setData([]);
            await db.execAsync("DROP TABLE IF EXISTS Plant; DROP TABLE IF EXISTS keywords;");
            dbInit(db);
          }}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto"/>
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
    fontSize: 18,
    paddingHorizontal: 20,
    paddingBottom:25,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width,
  },
  loadData: {
    width: width * 0.6,
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
  },
  reset: {
    width: width * 0.3,
    backgroundColor: '#ff0000',
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    marginBottom: 20
  },
  resetText: {
    color: "#fff",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});
