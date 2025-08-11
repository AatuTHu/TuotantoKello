import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import TopBar from "../TopBar";
import { useStates } from "../../service/contexts/StateContext";

const formatTime = (totalSeconds) => {
  if (totalSeconds < 60) {
    return `${totalSeconds} s`;
  } else {
    const hour = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;
    if (hour > 0) {
      return `${hour} h ${min} min ${sec} s`;
    } else {
      return sec > 0 ? `${min} min ${sec} s` : `${min} min`;
    }
  }
};

export default function Analytics() {
  const { selectedItems } = useStates();
  const [workerCount, setWorkerCount] = useState("1");
  const [count, setCount] = useState("10");
  const [useOptimization, setUseOptimization] = useState(false);
  const [optimizationPercent, setOptimizationPercent] = useState(5);

  // Uusi tila useille vain kerran laskettaville vaiheille
  const [singleCountPhases, setSingleCountPhases] = useState([]);

  const productCount = parseInt(count, 10);
  const isValidCount = !isNaN(productCount) && productCount > 0;

  // Vaiheen valintafunktio
  const toggleSinglePhase = (phaseName) => {
    setSingleCountPhases((prev) =>
      prev.includes(phaseName)
        ? prev.filter((name) => name !== phaseName)
        : [...prev, phaseName]
    );
  };

  // Lasketaan per yksikkö aika ja vain kerran laskettavat vaiheet
  let perUnitTime = 0;
  let singleTime = 0;

  if (selectedItems.phases) {
    selectedItems.phases.forEach((phase) => {
      if (singleCountPhases.includes(phase.phaseName)) {
        singleTime += phase.time;
      } else {
        perUnitTime += phase.time;
      }
    });
  } else {
    perUnitTime = selectedItems.totalTime ?? 0;
  }

  // Kokonaisaika ilman optimointia
  const totalTime = isValidCount
    ? (perUnitTime * productCount) + singleTime
    : 0;

  // Työntekijöiden määrä rajattuna 1-3
  const workerNum = parseInt(workerCount, 10) || 1;
  const effectiveWorkerNum = Math.min(Math.max(workerNum, 1), 3);

  // Jaetaan työntekijöiden määrällä
  const timeWithWorkers = totalTime / effectiveWorkerNum;

  // Optimoinnin kerroin
  const optimizationFactor = 1 - optimizationPercent / 100;

  // Lopullinen aika optimoinnin huomioiden
  const optimizedTotalTime = useOptimization
    ? timeWithWorkers * optimizationFactor
    : timeWithWorkers;

  return (
    <View style={styles.container}>
      <TopBar />
      <Text style={[styles.header, { fontSize: 25 }]}>Analytiikkaa tuotteelle:</Text>
      <Text style={[styles.header, { fontWeight: "normal" }]}>{selectedItems.mainTitle}</Text>

      <ScrollView>
        <View style={{ width: "100%", paddingHorizontal: 20 }}>
          <Text style={styles.label}>Tehtävien tuotteiden määrä:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={count}
            onChangeText={setCount}
          />

          <Text style={styles.label}>Työntekijöiden määrä (1-3):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={workerCount}
            onChangeText={(text) => {
              const filtered = text.replace(/[^0-9]/g, "");
              if (filtered === "") {
                setWorkerCount("");
                return;
              }
              let val = parseInt(filtered, 10);
              if (val < 1) val = 1;
              if (val > 3) val = 3;
              setWorkerCount(val.toString());
            }}
          />

          <Text style={[styles.label, { marginTop: 20, marginBottom: 0 }]}>
            Valitse vaiheet, jotka huomioidaan vain kerran (voi valita useita)
          </Text>
          <ScrollView style={{ maxHeight: 140 }}>
            {selectedItems.phases.map((phase, idx) => {
              const isSelected = singleCountPhases.includes(phase.phaseName);
              return (
                <TouchableOpacity
                  key={idx}
                  style={{
                    backgroundColor: isSelected ? "#00cc99" : "transparent",
                    padding: 5,
                    borderRadius: 5,
                    marginVertical: 2
                  }}
                  onPress={() => toggleSinglePhase(phase.phaseName)}
                >
                  <Text style={[styles.phaseText, { color: isSelected ? "#000" : "#ccc" }]}>
                    {phase.phaseName}: {formatTime(phase.time)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.result, { marginTop: 10 }]}>
            Yhden tuotteen valmistusaika: {formatTime(perUnitTime)}
          </Text>
        </View>

        {isValidCount && (
          <View style={{ width: "100%", paddingHorizontal: 20 }}>
            <Text style={styles.label}>Huomioidaanko työn rytmin tuoma tehokkuus?</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <Switch value={useOptimization} onValueChange={setUseOptimization} />
              <Text style={{ color: "#ccc", marginLeft: 10 }}>
                {useOptimization ? `Kyllä (${optimizationPercent} % nopeampi)` : "Ei"}
              </Text>
            </View>

            {useOptimization && (
              <>
                <Text style={styles.label}>Optimoinnin määrä: {optimizationPercent}%</Text>
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={optimizationPercent}
                  minimumTrackTintColor="#00cc99"
                  maximumTrackTintColor="#888"
                  thumbTintColor="#00cc99"
                  onValueChange={setOptimizationPercent}
                />
              </>
            )}

            <Text style={styles.result}>
              Kokonaisaika ({productCount} kpl, {effectiveWorkerNum} työntekijää):
            </Text>
            <Text style={[styles.result, { color: "lightblue" }]}>
              {formatTime(optimizedTotalTime.toFixed(0))}
            </Text>

            {useOptimization && (
              <Text style={[styles.result, { color: "green" }]}>
                Säästö: {formatTime(totalTime - optimizedTotalTime.toFixed(0))} (
                {optimizationPercent}
                %)
              </Text>
            )}
          </View>
        )}

        <View style={{ marginTop: 20, marginLeft: 2 }}>
          <Text style={[styles.label, { marginBottom: 0 }]}>Käytetyt kaavat:</Text>
          <Text style={styles.formula}>
            Kokonaisaika = (tuotemäärä × muiden vaiheiden aika) + (vain kerran laskettavien vaiheiden aika)
          </Text>
          <Text style={styles.formula}>
            Optimoitu aika = kokonaisaika × (1 − optimointi prosentti / 100)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#222",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
    paddingHorizontal: 10,
  },
  label: { fontSize: 16, color: "#fff", marginBottom: 5 },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 3,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 17,
    backgroundColor: "#fff",
  },
  result: { fontSize: 16, marginTop: 10, color: "#fff" },
  phaseText: { fontSize: 17, color: "#ccc", marginLeft: 10 },
  formula: {
    fontSize: 13,
    color: "#ccc",
    fontStyle: "italic",
    marginTop: 5,
  },
});
