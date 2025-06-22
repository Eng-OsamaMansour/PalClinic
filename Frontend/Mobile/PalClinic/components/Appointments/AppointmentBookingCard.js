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

/* tiny util to prettify 09:00:00 → 09:00 */
const tidyTime = (t = "") => t.slice(0, 5);

export default function AppointmentBookingCard({
  appointment,
  onBook = () => {}, // wire later
}) {
  const { doctor_name, date, time, available, status } = appointment;

  return (
    <View style={styles.card}>
      {/* ── Header: doctor & availability badge ───────────── */}
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name="account-heart"
          size={20}
          color={Theme.accent}
          style={styles.icon}
        />
        <Text style={styles.doctor}>{doctor_name}</Text>

        <View
          style={[
            styles.availBadge,
            { backgroundColor: available ? Theme.success : Theme.danger },
          ]}
        >
          <Text style={styles.availText}>
            {available ? "متاح" : "غير متاح"}
          </Text>
        </View>
      </View>

      {/* ── Date & time row ──────────────────────────────── */}
      <View style={styles.dateTimeRow}>
        <MaterialCommunityIcons
          name="calendar-month"
          size={18}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <Text style={styles.dateText}>{date}</Text>

        <MaterialCommunityIcons
          name="clock-time-four-outline"
          size={18}
          color={Theme.textSecondary}
          style={[styles.icon, styles.timeIcon]}
        />
        <Text style={styles.timeText}>{tidyTime(time)}</Text>
      </View>

      {/* ── Booking button ───────────────────────────────── */}
      <TouchableOpacity
        style={[
          styles.bookBtn,
          !available && styles.bookBtnDisabled,
        ]}
        disabled={!available}
        onPress={() => onBook(appointment)} // implement later
      >
        <MaterialCommunityIcons
          name="calendar-check"
          size={18}
          color={Theme.textInverse}
        />
        <Text style={styles.bookText}>حجز الموعد</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ───────────── Styles ───────────── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.medium,
    marginBottom: Theme.spacing.medium,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    alignItems: "flex-end",
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "flex-end",
  },
  icon: { marginHorizontal: Theme.spacing.tiny },
  doctor: {
    flex: 1,
    fontSize: Theme.fontSize.heading,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
    textAlign: "right",
  },
  availBadge: {
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
    marginLeft: Theme.spacing.tiny,
  },
  availText: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.textInverse,
    fontWeight: Theme.fontWeight.medium,
  },
  dateTimeRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "flex-end",
  },
  dateText: {
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
    marginLeft: Theme.spacing.tiny,
  },
  timeIcon: { marginLeft: Theme.spacing.large },
  timeText: {
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
    marginLeft: Theme.spacing.tiny,
  },
  bookBtn: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: Theme.accent,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
    
    alignSelf: "flex-end",
  },
  bookBtnDisabled: {
    backgroundColor: Theme.disabled,
  },
  bookText: {
    color: Theme.textInverse,
    marginHorizontal: Theme.spacing.tiny,
    fontSize: Theme.fontSize.small,
    fontWeight: Theme.fontWeight.medium,
  },
});
