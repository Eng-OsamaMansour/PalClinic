// components/Requests/RequestCard.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import { Theme } from "../../assets/Theme/Theme1";

export default function RequestCard({
  request,
  onDelete = () => {},   // wire later
  onToggle = () => {},   // wire later
}) {
  const { doctor, created_at, status, is_active } = request;

  const statusColor =
    status === "accepted"
      ? Theme.success
      : status === "rejected"
      ? Theme.danger
      : Theme.warning;

  return (
    <View style={styles.card}>
      {/* Doctor + status */}
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name="account-heart"
          size={20}
          color={Theme.accent}
          style={styles.icon}
        />
        <Text style={styles.doctor}>{doctor.name}</Text>

        <View style={[styles.statusChip, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Created at */}
      <View style={styles.dateRow}>
        <MaterialCommunityIcons
          name="calendar-clock"
          size={16}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <Text style={styles.dateTxt}>
          {dayjs(created_at).format("DD/MM/YYYY — HH:mm")}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, styles.delBtn]}
          onPress={() => onDelete(request)}
        >
          <Text style={styles.btnTxt}>حذف</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.toggleBtn]}
          onPress={() => onToggle(request)}
        >
          <Text style={styles.btnTxt}>
            {is_active ? "تعطيل" : "تفعيل"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.medium,
    marginBottom: Theme.spacing.medium,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
    alignItems: "flex-end",
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "stretch",
  },
  icon: { marginHorizontal: Theme.spacing.tiny },
  doctor: {
    flex: 1,
    fontSize: Theme.fontSize.heading,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
    textAlign: "right",
  },
  statusChip: {
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
  },
  statusText: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.textInverse,
    fontWeight: Theme.fontWeight.medium,
  },
  dateRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "stretch",
  },
  dateTxt: {
    fontSize: Theme.fontSize.small,
    color: Theme.textSecondary,
    textAlign: "right",
  },
  btnRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignSelf: "flex-end",
  },
  btn: {
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.medium,
    paddingVertical: Theme.spacing.tiny,
    marginLeft: Theme.spacing.small,
  },
  delBtn: { backgroundColor: Theme.danger },
  toggleBtn: { backgroundColor: Theme.accent },
  btnTxt: {
    color: Theme.textInverse,
    fontSize: Theme.fontSize.small,
    fontWeight: Theme.fontWeight.medium,
  },
});
