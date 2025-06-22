import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Ionicons } from "@expo/vector-icons"; // for menu icon
import { useNavigation } from "@react-navigation/native";
import {SignOut} from "../../api/signout";
import { Theme } from "../../assets/Theme/Theme1";
import { clearTokens } from "../../config/TokenManager";
import { AuthCtx } from "../../contexts/AuthContext";

export default function TopBadge() {
  const {logoutCtx} = useContext(AuthCtx)
  const navigator = useNavigation();
  const onChatPress = () =>{
    navigator.navigate("ChatList")
  }

const logout = async () => {
  try {
    await SignOut();
  } catch (err) {
    console.error("Sign out error:", err);
    // optionally show a toast or alert
  }

  await clearTokens();
  logoutCtx();
};


  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={{ position: "absolute", left: 16 }} onPress={logout}>
        <SimpleLineIcons name="logout" size={26} color={Theme.accent} />
      </TouchableOpacity>
      <View style={styles.centerContent}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>PalClinic</Text>
      </View>

      <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
        <Ionicons name="chatbubbles-outline" size={26} color={Theme.accent} />
      </TouchableOpacity>
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
