import { StatusBar } from 'expo-status-bar';
import { StyleSheet,View } from 'react-native';
import Timer from './components/screens/Timer';
import Controller from './components/Controller';
import InvalidScreen from './components/screens/InvalidScreen';
import Settings from './components/screens/Settings';
import Navigation from './service/contexts/NavigationContext';
import StateContext from './service/contexts/StateContext';
import Analytics from './components/screens/Analytics';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <StateContext>  
          <Navigation>
            <InvalidScreen/>
            <Controller/>
            <Timer/>
            <Settings/>
            <Analytics/>
          </Navigation>
      </StateContext>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09122C',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
