import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../../styles/printer';
import * as Print from 'expo-print';
import { makeTimeStamp, formatTime } from '../../service/Utilities';
import TopBar from '../TopBar';
import { Ionicons } from '@expo/vector-icons';
import { useStates } from '../../service/contexts/StateContext';



export default function Printer() {
  const [selectedPrinter, setSelectedPrinter] = useState();
  const { selectedItems } = useStates()
  
  const print = async (item) => {
  const mappedPhases = item.phases
    .map(
      (phase, index) =>
        `<tr>
          <td>${index + 1}</td>
          <td>${phase.phaseName}</td>
          <td>${formatTime(phase.time)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        body {
          font-family: 'Arial', sans-serif;
          text-align: center;
          color: #333;
          padding: 20px;
        }
        h1 {
          font-size: 40px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          max-width: 600px;
          margin: auto;
          border-collapse: collapse;
          background: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background: #007bff;
          color: white;
        }
        div {
          margin-top: 20px;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <h1>${item.mainTitle} ${formatTime(item.totalTime)}</h1>
      <table>
        <tr>
          <th>#</th>
          <th>Vaihe</th>
          <th>Aika</th>
        </tr>
        ${mappedPhases}
      </table>
      <div>${makeTimeStamp()}</div>
      <div>Mittaaja: ${item.userName}</div>
    </body>
    </html>
  `;

  await Print.printAsync({
    html,
    printerUrl: selectedPrinter?.url,
  });
};

  const renderPhases = (phases) => (
    phases.map((item, index) => (
      <View key={index} style={styles.dataContainer}>
        <Text style={{ fontSize: 20, color: 'black', width: '20%' }}>
          {index + 1}
        </Text> 
        <Text style={{ fontSize: 20, color: 'black', borderLeftWidth: 1, borderRightWidth: 1, width: "60%", textAlign: 'center' }}>
          {item.phaseName}
        </Text>
        <Text style={{ fontSize: 20, color: 'black', width: '20%', textAlign: 'right' }}>
          {Math.floor(item.time / 60)}:
          {item.time % 60 < 10 ? `0${item.time % 60}` : item.time % 60}
        </Text>
      </View>
    ))
  );
  
  return (
    <View style={styles.container}>
      <TopBar/>
      <View style={{justifyContent: 'space-between',alignItems: 'center',width: '100%'}}>
          <View style={styles.page}>
            <Text style={styles.title}>{selectedItems.mainTitle}</Text>
              {renderPhases(selectedItems.phases)}
          <View style={{flexDirection: "row", width:"100%", alignItems:"center", justifyContent:"space-between", padding: 5}}>
            <Text style={{ fontSize: 20, color: 'black'}}>Kokonaisaika {formatTime(selectedItems.totalTime)}</Text>
            <TouchableOpacity style={styles.button} onPress={() => print(selectedItems)}>
                <Ionicons name='print-outline' size={43} color={"#BE3144"}/>
            </TouchableOpacity>
          </View>
          </View>
      </View>
    </View>
  );
}
