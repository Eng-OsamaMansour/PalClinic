import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TopTabNavigator2 from "../components/Structure/NavigatorTab";
import TopTabNavigator from "../components/Structure/TopNav";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../assets/Theme/Theme1";
export default function Main() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <TopTabNavigator />
        <TopTabNavigator2 />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: Theme.background,
  },
});
