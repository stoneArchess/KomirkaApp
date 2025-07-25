import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from './AccountScreen';
import WalletScreen from './WalletScreen';
import ProfileScreen from "@/app/profile";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen 
          name="Wallet" 
          component={WalletScreen} 
          options={{ title: 'Гаманець' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Профіль' }}
        />
        <Stack.Screen 
          name="Account" 
          component={AccountScreen} 
          options={{ title: 'Мій акаунт' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;