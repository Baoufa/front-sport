import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen.jsx';
import SubProgramScreen from './screens/SubProgramScreen.jsx';
import ActivityScreen from './screens/ActivityScreen.jsx';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='SubProgram' component={SubProgramScreen} />
        <Stack.Screen name='Activity' component={ActivityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
