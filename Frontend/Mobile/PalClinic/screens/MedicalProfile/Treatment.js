import React, { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import TopTabNavigator from "../../components/Structure/TopSecNav";
import TreatmentCard from "../../components/MedicalProfile/TreatmentCard";
import { Theme } from "../../assets/Theme/Theme1";

export default function Treatment() {
  /* ────────────── data from navigation ────────────── */
  const { params } = useRoute();
  const raw = params?.data ?? [];

  /* Ensure active items are first for the "all" view */
  const sorted = useMemo(
    () => [...raw].sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0)),
    [raw]
  );

  /* ────────────── filter state ────────────── */
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'inactive'

  const displayed = useMemo(() => {
    if (filter === "active") return sorted.filter((t) => t.active);
    if (filter === "inactive") return sorted.filter((t) => !t.active);
    return sorted; // all
  }, [filter, sorted]);

  /* ────────────── UI ────────────── */
  const renderChip = (label, value) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.chip,
        filter === value && styles.chipActive,
        /* row-reverse keeps text right-aligned */
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[styles.chipText, filter === value && styles.chipTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <TopTabNavigator />

      {/* Filter row */}
      <View style={styles.chipRow}>
        {renderChip("غير النشطة", "inactive")}
        {renderChip("النشطة", "active")}
        {renderChip("الكل", "all")}
      </View>

      {/* List */}
      {displayed.length === 0 ? (
        <Text style={styles.noData}>لا توجد وصفات مطابقة</Text>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({ item }) => <TreatmentCard treatment={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

/* ────────────── styles ────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.background },

  /* chips */
  chipRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.medium,
    marginTop: Theme.spacing.small,
    marginBottom: Theme.spacing.small,
    gap: Theme.spacing.small,
  },
  chip: {
    borderRadius: Theme.borderRadius.small,
    borderWidth: 1,
    borderColor: Theme.accent,
    paddingHorizontal: Theme.spacing.medium,
    paddingVertical: Theme.spacing.tiny,
  },
  chipActive: {
    backgroundColor: Theme.accent,
  },
  chipText: {
    fontSize: Theme.fontSize.small,
    color: Theme.accent,
    textAlign: "center",
  },
  chipTextActive: {
    color: Theme.textInverse,
    fontWeight: Theme.fontWeight.medium,
  },

  list: { padding: Theme.spacing.medium },

  noData: {
    textAlign: "center",
    marginTop: Theme.spacing.large,
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
  },
});
