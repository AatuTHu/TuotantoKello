import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { BackHandler } from 'react-native';

export const NavigationContext = createContext();

export default function Navigation({ children }) {
  const [navigate, setNavigate] = useState("Controller"); // Target page name
  const [history, setHistory] = useState([0]); // Keeps track of visited pages
  const [number, setNumber] = useState(0); // Current page index
  const exitIndex = [0]; // Pages where back exits the app

  // Store page names in an array (memoized to prevent unnecessary re-renders)
  const pages = useMemo(() => children.map((n) => n.type.name), [children]);

  // Update number & history when navigate changes
  useEffect(() => {
    const pageIndex = pages.indexOf(navigate);
    if (pageIndex !== -1 && pageIndex !== number) {
      setNumber(pageIndex);
    }
  }, [navigate, pages]);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      setNavigate('Controller')
      return true;
      
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [number]);

  return (
    <NavigationContext.Provider value={{ setNavigate, navigate }}>
      {children[number]}
    </NavigationContext.Provider>
  );
}
export const useNavigation = () => useContext(NavigationContext)