import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

function AuthNavigator(props) {
  const Stack = createNativeStackNavigator();

  console.log(props);

  return (
    <Stack.Navigator
       initialRouteName='Authentification'
    //   screenOptions={{ headerShown: true }}
    // screenOptions={{
    //   headerStyle: { backgroundColor: "red" },
    //   headerTintColor: "blue",
    // }}
    >
      <Stack.Screen
        name='Login'
        options={{ headerTitle: 'Authentification' }}
        component={LoginScreen}
      />
      <Stack.Screen
        name='Register'
        options={{ headerTitle: 'Enregistrement' }}
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
}
export default AuthNavigator;
