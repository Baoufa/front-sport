import { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeNavigator from './navigators/HomeNavigator.jsx';
import HistoricNavigator from './navigators/HistoricNavigator.jsx';
import AuthNavigator from './navigators/AuthNavigator.jsx';
import AppNavigation from './navigators/AppNavigation.jsx';

import AuthContext from './context/AuthContext.jsx';

import { Icon } from '@rneui/themed';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://192.168.1.55:4000/graphql',
  cache: new InMemoryCache({ addTypename: false }),
});

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <ApolloProvider client={client}>
      <AuthContext>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </AuthContext>
    </ApolloProvider>
  );
}
