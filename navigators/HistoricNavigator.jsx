import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HistoricScreen from './../screens/HistoricScreen';

function HistoricNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Historic"
      // screenOptions={{headerShown: false}}
      // screenOptions={{
      //   headerStyle: { backgroundColor: "red" },
      //   headerTintColor: "blue",
      // }}
    >
      <Stack.Screen
        name="History"
        options={{
          headerTitle: "Historic",
        }}
        component={HistoricScreen}
      />
     
    </Stack.Navigator>
  );
}
export default HistoricNavigator;
