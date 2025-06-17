import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  I18nManager,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../assets/Theme/Theme1";

export default function TreatmentCard({ treatment }) {
  /* --- derived helpers --------------------------------------------------- */
  const {
    treatment: name,
    dosage,
    start_date,
    end_date,
    doctor,
    description,
    report,
    active,
  } = treatment;

  const openReport = () => {
    if (report) Linking.openURL(report);
  };

  return (
    <View style={styles.card}>
      {/* ── Header: name + status icon ───────────────────────────────────── */}
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name="pill"
          size={20}
          color={Theme.accent}
          style={styles.icon}
        />
        <Text style={styles.name}>{name}</Text>
        {active ? (
          <MaterialCommunityIcons
            name="check-circle"
            size={18}
            color={Theme.success}
          />
        ) : (
          <MaterialCommunityIcons
            name="close-circle"
            size={18}
            color={Theme.danger}
          />
        )}
      </View>

      {/* ── Doctor row ───────────────────────────────────────────────────── */}
      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="account-heart"
          size={18}
          color={Theme.primary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{doctor.name}</Text>
      </View>

      {/* ── Dosage row ───────────────────────────────────────────────────── */}
      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="timelapse"
          size={18}
          color={Theme.primary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{dosage}</Text>
      </View>

      {/* ── Dates row ────────────────────────────────────────────────────── */}
      <View style={styles.datesRow}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>من {start_date}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>إلى {end_date}</Text>
        </View>
      </View>

      {/* ── Description ─────────────────────────────────────────────────── */}
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

/* ─────────────────────────── Styles ───────────────────────────────────── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.medium,
    padding: Theme.spacing.medium,
    marginBottom: Theme.spacing.medium,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-end", // entire column sticks to right
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "flex-end",
  },
  icon: {
    marginHorizontal: Theme.spacing.tiny,
  },
  name: {
    flex: 1,
    fontSize: Theme.fontSize.heading,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
    textAlign: "right",
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.tiny,
    alignSelf: "flex-end",
  },
  infoText: {
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
    textAlign: "right",
    marginLeft: Theme.spacing.tiny,
  },
  datesRow: {
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
    marginBottom: Theme.spacing.small,
  },
  dateBadge: {
    backgroundColor: Theme.primaryLight,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
    marginLeft: Theme.spacing.tiny,
  },
  dateText: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  description: {
    fontSize: Theme.fontSize.small,
    color: Theme.textPrimary,
    marginBottom: Theme.spacing.small,
    lineHeight: 20,
    textAlign: "right",
  },
});
