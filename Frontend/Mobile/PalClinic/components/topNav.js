import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // for chat icon

export default function TopBadge({ onChatPress }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.centerContent}>
        <Image
          source={require("../assets/images/logo.png")} 
          style={styles.logo}
        />
        <Text style={styles.title}>PalClinic</Text>
      </View>

      <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
        <Ionicons name="chatbubbles-outline" size={26} color="#007bff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "relative",
  },
  centerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
  chatButton: {
    position: "absolute",
    right: 16,
  },
});
