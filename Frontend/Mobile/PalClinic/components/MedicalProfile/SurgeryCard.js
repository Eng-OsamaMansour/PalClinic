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

export default function SurgeryCard({ surgery }) {
  const openReport = () => {
    if (surgery.report) Linking.openURL(surgery.report);
  };

  return (
    <View style={styles.card}>
      {/* ── Header: type + date badge ─────────────────────────── */}
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name="medical-bag"
          size={20}
          color={Theme.accent}
          style={styles.icon}
        />
        <Text style={styles.type}>{surgery.surgery_type}</Text>

        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{surgery.surgery_date}</Text>
        </View>
      </View>

      {/* ── Doctor row ───────────────────────────────────────── */}
      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="account-heart"
          size={18}
          color={Theme.primary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{surgery.doctor.name}</Text>
      </View>

      {/* ── Description ──────────────────────────────────────── */}
      <Text style={styles.description}>{surgery.description}</Text>

      {/* ── Report button (optional) ─────────────────────────── */}
      {surgery.report && (
        <TouchableOpacity style={styles.reportBtn} onPress={openReport}>
          <Text style={styles.reportText}>عرض التقرير</Text>
          <MaterialCommunityIcons
            name="file-pdf-box"
            size={18}
            color={Theme.textInverse}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    /* cross-axis alignment */
    alignItems: I18nManager.isRTL ? "flex-end" : "flex-start",

    /* main-axis spacing (keep as needed) */
    justifyContent: "space-between",

    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.medium,
    padding: Theme.spacing.medium,
    marginBottom: Theme.spacing.medium,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "flex-end", // <–– card edge hugs the row
  },
  icon: {
    marginHorizontal: Theme.spacing.tiny,
  },
  type: {
    flex: 1,
    fontSize: Theme.fontSize.heading,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
    textAlign: "right",
  },
  dateBadge: {
    backgroundColor: Theme.primaryLight,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
  },
  dateText: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "flex-end", // <–– shrink row to its content
    maxWidth: "90%",
  },
  infoText: {
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
    textAlign: "right",
    marginLeft: Theme.spacing.tiny,
  },
  description: {
    fontSize: Theme.fontSize.small,
    color: Theme.textPrimary,
    marginBottom: Theme.spacing.small,
    lineHeight: 20,
    textAlign: "right",
  },
  reportBtn: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: Theme.accent,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
    alignSelf: "flex-end",
  },
  reportText: {
    color: Theme.textInverse,
    marginHorizontal: Theme.spacing.tiny,
    fontSize: Theme.fontSize.small,
    fontWeight: Theme.fontWeight.medium,
  },
});
