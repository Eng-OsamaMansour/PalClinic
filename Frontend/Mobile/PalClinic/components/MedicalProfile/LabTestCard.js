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

export default function LabTestCard({ test }) {
  const openPDF = () => {
    if (test.results) Linking.openURL(test.results);
  };

  return (
    <View style={styles.card}>
      {/* ── Header: name + date badge ──────────────────────────────── */}
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name="flask"
          size={20}
          color={Theme.accent}
          style={styles.icon}
        />
        <Text style={styles.name}>{test.name}</Text>

        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{test.date}</Text>
        </View>
      </View>

      {/* ── Description ───────────────────────────────────────────── */}
      {test.description && (
        <Text style={styles.description}>{test.description}</Text>
      )}

      {/* ── PDF results button (optional) ────────────────────────── */}
      {test.results && (
        <TouchableOpacity style={styles.pdfBtn} onPress={openPDF}>
          <MaterialCommunityIcons
            name="file-pdf-box"
            size={18}
            color={Theme.textInverse}
          />
          <Text style={styles.pdfText}>عرض النتيجة</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ───────────────────── Styles ───────────────────── */
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
    alignItems: "flex-end",
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
  pdfBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: Theme.accent,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
    alignSelf: "flex-end",
  },
  pdfText: {
    color: Theme.textInverse,
    marginHorizontal: Theme.spacing.tiny,
    fontSize: Theme.fontSize.small,
    fontWeight: Theme.fontWeight.medium,
  },
});
