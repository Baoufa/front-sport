import { useState } from 'react';

import useAuthContext from '../hooks/useAuthContext';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeNavigator from './HomeNavigator.jsx';
import HistoricNavigator from './HistoricNavigator.jsx';
import AuthNavigator from './AuthNavigator.jsx';

import { Icon } from '@rneui/themed';

const Tab = createMaterialTopTabNavigator();

const AppNavigation = () => {
  const {isAuth} = useAuthContext();

  if(!isAuth) {
    return <AuthNavigator />;
  }

  if (isAuth) {
    return (
      <Tab.Navigator tabBarPosition='bottom'>
        <Tab.Screen
          options={{
            tabBarLabel: 'Accueil',
            tabBarIcon: () => (
              <Icon name='ios-american-football' type='ionicon' />
            ),
          }}
          name='HomeTab'
          component={HomeNavigator}
        />
        <Tab.Screen name='HistoricTab' component={HistoricNavigator} />
      </Tab.Navigator>
    );
  }
};

export default AppNavigation;
