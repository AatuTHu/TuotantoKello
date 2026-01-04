import { useState, createContext, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const StateContext = createContext()

export default function States({children}) {

  const [existingTitle, setExistingTitle] = useState("");
  const [existingPhases, setExistingPhases] = useState([]);
  const [existingMainTime, setExistingMainTime] = useState("")
  const [selectedItems, setSelectedItems] = useState([]);
  const [existingUserName,setExistingUserName] = useState("")

    return (
      <StateContext.Provider value={{ 
       setExistingMainTime,
       setExistingPhases, 
       setExistingTitle, 
       existingTitle, 
       existingPhases, 
       existingMainTime,
       existingUserName, 
       setExistingUserName,
       selectedItems,
       setSelectedItems}}>
        {children}
      </StateContext.Provider>
    )  
} //function

export const useStates = () => useContext(StateContext)