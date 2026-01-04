import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import TopBar from "../TopBar";
import { useStates } from "../../service/contexts/StateContext";
import { formatTimeWithUnits, formatTimeInDays } from "../../service/Utilities"
import { styles } from "../../styles/analytics"

export default function Analytics() {

  const { selectedItems } = useStates();
  const [workerCount, setWorkerCount] = useState("1");
  const [count, setCount] = useState("10");
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
                    {phase.phaseName}: {formatTimeWithUnits(phase.time)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.result, { marginTop: 10 }]}>
            Yhden tuotteen valmistusaika: {formatTimeWithUnits(perUnitTime)}
          </Text>
        </View>

        {isValidCount && (
          <View style={{ width: "100%", paddingHorizontal: 20 }}>      
            <Text style={styles.result}>
              Kokonaisaika ({productCount} kpl, {effectiveWorkerNum} työntekijää):
            </Text>
            <Text style={[styles.result, { color: "lightblue" }]}>
              {formatTimeWithUnits(timeWithWorkers)}
            </Text>
             <Text style={[styles.result, { color: "lightblue" }]}>
              {formatTimeInDays(timeWithWorkers)}
            </Text>
          </View>
        )}

        <View style={{ marginTop: 20, marginLeft: 2 }}>
          <Text style={[styles.label, { marginBottom: 0 }]}>Käytetyt kaavat:</Text>
          <Text style={styles.formula}>
            Kokonaisaika = (tuotemäärä × muiden vaiheiden aika) + (vain kerran laskettavien vaiheiden aika)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}