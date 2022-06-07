import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen.jsx';
import SubProgramScreen from './screens/SubProgramScreen.jsx';
import ActivityScreen from './screens/ActivityScreen.jsx';


import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

const Stack = createNativeStackNavigator();

const client = new ApolloClient({
  uri: 'http://192.168.1.55:4000/graphql',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen
            name='SubProgram'
            options={{ headerTitle: 'Sous Programmes' }}
            component={SubProgramScreen}
          />
          <Stack.Screen
            name='Activity'
            options={{ headerTitle: 'Activité' }}
            component={ActivityScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
