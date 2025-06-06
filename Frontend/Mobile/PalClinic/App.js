import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashMessage from "react-native-flash-message";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Home from "./screens/main";
import { getAccessToken, getRefreshToken } from "./config/tokenManager";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>

        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="bottom" />
    </>
  );
}
