import { useState, createContext, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const StateContext = createContext()

export default function States({children}) {

  const [existingTitle, setExistingTitle] = useState("");
  const [existingPhases, setExistingPhases] = useState([]);
  const [existingMainTime, setExistingMainTime] = useState("")
  const [deletesOn, setDeletesOn] = useState(false)
  const [selectedItems, setSelectedItems] = useState([]);
  const [existingUserName,setExistingUserName] = useState("")

  useEffect(() => {
    const loadToggleState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('deletesOn');
        if (storedState !== null) {
          setDeletesOn(JSON.parse(storedState));
        }
      } catch (error) {
        console.error('Virhe ladattaessa tallennettua tilaa:', error);
      }
    };
    loadToggleState();
  }, []);
  
    return (
      <StateContext.Provider value={{ 
        setExistingMainTime,
       setExistingPhases, 
       setExistingTitle, 
       existingTitle, 
       existingPhases, 
       existingMainTime, 
       deletesOn, 
       setDeletesOn, 
       existingUserName, 
       setExistingUserName,
       selectedItems,
       setSelectedItems}}>
        {children}
      </StateContext.Provider>
    )  
} //function

export const useStates = () => useContext(StateContext)