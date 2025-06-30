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
import HealthCenterChooser from "./screens/HealthCareCenters/HealthCentersChooser";
import HealthCentersView from "./screens/HealthCareCenters/HealthCentersView";
import ClinicsView from "./screens/Clinics/ClinicsView";
import AppointmentsView from "./screens/Appointments/AppointmentsView";
import ChatListScreen from "./screens/ChatListScreen";
import ChatScreen from "./screens/ChatScreen";
const Stack = createNativeStackNavigator();
import { NotificationProvider } from "./contexts/NotificationContext";
import { ChatProvider } from "./contexts/ChatContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { AuthProvider, AuthCtx } from "./contexts/AuthContext";

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} initialRouteName="Login" />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <NotificationProvider>
      <ChatProvider>
        <Stack.Navigator>
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
          <Stack.Screen
            name="HealthCareCenterChooser"
            component={HealthCenterChooser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HealthCentersView"
            component={HealthCentersView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClinicsView"
            component={ClinicsView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AppointmentsView"
            component={AppointmentsView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatList"
            component={ChatListScreen}
            options={{ title: "الدردشات" }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={({ route }) => ({
              title: route.params?.room?.name.startsWith("assist-")
                ? "مساعد الذكاء الصناعي"
                : route.params?.room?.title,
            })}
          />
        </Stack.Navigator>

        <FlashMessage position="bottom" />
      </ChatProvider>
    </NotificationProvider>
  );
}

function Root() {
  const { access } = React.useContext(AuthCtx);
  return (
    <NavigationContainer>
      {access ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
      <FlashMessage position="bottom" />
    </AuthProvider>
  );
}
