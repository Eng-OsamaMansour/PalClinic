import React from "react";
import {
  View,
  Text,
  StyleSheet,
  I18nManager,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../assets/Theme/Theme1";

export default function DoctorNoteCard({ note }) {
  return (
    <View style={styles.card}>
      {/* ── Header: title + date ─────────────────────────────── */}
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name="note-text"
          size={20}
          color={Theme.accent}
          style={styles.icon}
        />
        <Text style={styles.title}>{note.title}</Text>

        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            {note.created_at.slice(0, 10)} {/* YYYY-MM-DD */}
          </Text>
        </View>
      </View>

      {/* ── Doctor row ───────────────────────────────────────── */}
      <View style={styles.docRow}>
        <MaterialCommunityIcons
          name="account-heart"
          size={18}
          color={Theme.primary}
          style={styles.icon}
        />
        <Text style={styles.docText}>{note.doctor.name}</Text>
      </View>

      {/* ── Note body ───────────────────────────────────────── */}
      <Text style={styles.body}>{note.note}</Text>
    </View>
  );
}

/* ───────────── Styles ───────────── */
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
  title: {
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
  docRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "flex-end",
  },
  docText: {
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
    textAlign: "right",
    marginLeft: Theme.spacing.tiny,
  },
  body: {
    fontSize: Theme.fontSize.small,
    color: Theme.textPrimary,
    lineHeight: 20,
    textAlign: "right",
  },
});
