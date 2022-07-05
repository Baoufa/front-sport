import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen.jsx';
import SubProgramScreen from '../screens/SubProgramScreen.jsx';
import ActivityScreen from '../screens/ActivityScreen.jsx';

function HomeNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName='Home'
      //   screenOptions={{ headerShown: true }}
      // screenOptions={{
      //   headerStyle: { backgroundColor: "red" },
      //   headerTintColor: "blue",
      // }}
    >
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
  );
}
export default HomeNavigator;
