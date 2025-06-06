import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Appointment() {
  return (
    <TouchableOpacity style={styles.container}>
      <Text>التاريخ</Text>
      <Text>الوقت</Text>
      <Text>الطبيب</Text>
      <Text>المركز الصحي</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    borderRadius: 10,
    alignItems: "flex-end",
    borderWidth: 1,
    padding: 10,
    borderColor: "blue",
    margin: 10,
    height: "20%",
    width: "95%",
  },
});
