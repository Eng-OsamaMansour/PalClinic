// components/TopTabNavigator.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Theme } from "../../assets/Theme/Theme1";

import HomeScreen from "../../screens/home";
import MedicalProfileScreen from "../../screens/medicalprofile";
import HealthCenter from "../../screens/healthCenter";
import Notifications from "../../screens/notifications";
import DoctorsRequests from "../../screens/DoctorsRequests";

const Tab = createMaterialTopTabNavigator();

export default function TopTabNavigator2() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowIcon: true,
          tabBarShowLabel: true,
          // -----------------------------------
          tabBarActiveTintColor: Theme.accent,
          tabBarInactiveTintColor: "gray",
          tabBarIndicatorStyle: { backgroundColor: Theme.accent, height: 3 },
          tabBarStyle: {
            backgroundColor: Theme.navBarBackground,
            borderBottomWidth: 1,
            borderBottomColor: Theme.border,
          },
          tabBarLabelStyle: { fontSize: 8, fontWeight: "50" },

          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case "الرئيسية":
                iconName = "home";
                return (
                  <FontAwesome name={iconName} size={size} color={color} />
                );
              case "الملف الطبي":
                iconName = "heart-pulse";
                return (
                  <FontAwesome6 name={iconName} size={size} color={color} />
                );
              case "المراكز الطبية":
                iconName = "hospital-o";
                return (
                  <FontAwesome name={iconName} size={size} color={color} />
                );
              case "الإشعارات":
                iconName = "notifications-sharp";
                return <Ionicons name={iconName} size={size} color={color} />;
              case "الاطباء":
                iconName = "user-md";
                return (
                  <FontAwesome name={iconName} size={size} color={color} />
                );
              default:
                return null;
            }
          },
        })}
      >
        <Tab.Screen name="الرئيسية" component={HomeScreen} />
        <Tab.Screen name="الملف الطبي" component={MedicalProfileScreen} />
        <Tab.Screen name="المراكز الطبية" component={HealthCenter} />
        <Tab.Screen name="الإشعارات" component={Notifications} />
        <Tab.Screen name="الاطباء" component={DoctorsRequests} />
      </Tab.Navigator>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  tabBarStyle: {
    backgroundColor: Theme.navBarBackground,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  tabBarIndicatorStyle: {
    backgroundColor: Theme.accent,
    height: 3,
  },
};
