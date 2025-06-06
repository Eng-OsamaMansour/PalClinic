import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomTabNavigator from "../components/buttomNav";
import TopTabNavigator from "../components/topNav";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Main() {
  return (
    <>
      <SafeAreaView>
        <TopTabNavigator />
      </SafeAreaView>
      <BottomTabNavigator />
    </>
  );
}
