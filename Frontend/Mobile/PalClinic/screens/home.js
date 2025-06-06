import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Appointment from "../components/appointment";
export default function Home() {
  return (
    <View style={styles.container}>
      <Appointment />
      <Appointment />
      <Appointment />
      <Appointment />
      <Appointment />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});