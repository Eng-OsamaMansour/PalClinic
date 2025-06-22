import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../assets/Theme/Theme1";
import dayjs from "dayjs";

export default function NotificationCard({ data, onPress }) {
  const { verb, actor_name, timestamp, unread } = data;

  return (
    <TouchableOpacity
      style={[styles.card, unread && styles.unread]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <MaterialCommunityIcons name="bell" size={20} color={Theme.accent} />
        <Text style={styles.text}>
          {actor_name} {verb}
        </Text>
      </View>
      <Text style={styles.date}>{dayjs(timestamp).fromNow()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.medium,
    padding: Theme.spacing.medium,
    marginBottom: Theme.spacing.small,
    alignSelf: "stretch",
  },
  unread: { backgroundColor: Theme.primaryLight },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  text: {
    flex: 1,
    color: Theme.textPrimary,
    fontSize: Theme.fontSize.normal,
    marginHorizontal: Theme.spacing.small,
    textAlign: "right",
  },
  date: {
    color: Theme.textSecondary,
    fontSize: Theme.fontSize.tiny,
    textAlign: "left",
    marginTop: Theme.spacing.tiny,
  },
});
