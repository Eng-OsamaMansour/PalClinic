import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { Theme } from "../../assets/Theme/Theme1";

export default function TopBadge({ onChatPress }) {
  return (
    <View style={styles.headerContainer}>
      {/* logout button */}
      <View style={styles.centerContent}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>PalClinic</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.medium,
    backgroundColor: Theme.navBarBackground,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    position: "relative",
    boxShadow: Theme.shadow,
  },
  centerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 8,
  },
  title: {
    fontSize: Theme.fontSize.title,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
  },
  chatButton: {
    position: "absolute",
    right: 16,
    color: Theme.primaryLight,
  },
});
