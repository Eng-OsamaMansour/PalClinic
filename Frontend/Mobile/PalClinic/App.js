import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashMessage from "react-native-flash-message";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Home from "./screens/main";
import BasicInfo from "./screens/MedicalProfile/BasicInfo";
import Surgeries from "./screens/MedicalProfile/Surgeries";
import LabTest from "./screens/MedicalProfile/LabTest";
import Treatment from "./screens/MedicalProfile/Treatment";
import DoctorNote from "./screens/MedicalProfile/DoctorNote";
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BasicInfo"
            component={BasicInfo}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Surgeries"
            component={Surgeries}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Treatment"
            component={Treatment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LabTest"
            component={LabTest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DoctorNote"
            component={DoctorNote}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="bottom" />
    </>
  );
}
