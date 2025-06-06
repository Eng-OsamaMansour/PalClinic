import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/home";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MedicalProfileScreen from "../screens/medicalprofile";
import HealthCenter from "../screens/healthCenter";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Notifications from "../screens/notifications";
const Tab = createBottomTabNavigator();
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "الرئيسية") {
            iconName = "home" ;
          } else if (route.name === "الملف الطبي") {
            iconName = "heart-pulse";
            return <FontAwesome6 name={iconName} size={size} color={color} />;
          } else if (route.name === "المراكز الطبية") {
            iconName = "hospital-o";
          } else if (route.name === "الإشعارات") {
            iconName = "notifications-sharp";
            return <Ionicons name={iconName} size={size} color={color} />;
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "black",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen
        name="الرئيسية"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="الملف الطبي"
        component={MedicalProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="المراكز الطبية"
        component={HealthCenter}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="الإشعارات"
        component={Notifications}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
