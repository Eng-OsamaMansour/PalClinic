import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TopTabNavigator from "../../components/Structure/TopSecNav";
import CenterCard from "../../components/HealthCare/CenterCard";
import { Theme } from "../../assets/Theme/Theme1";

export default function HealthCenterView() {
  /* ───────── Data from route ───────── */
  const { params } = useRoute();
  const data = params?.data ?? [];

  /* ───────── Search state ───────── */
  const [query, setQuery] = useState("");

  /* ───────── Derived filtered list ───────── */
  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((center) =>
      [
        center.name,
        center.discrption,
        center.address,
        center.email,
        center.phoneNumber,
      ]
        .filter(Boolean) // skip undefined
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [query, data]);

  /* ───────── UI ───────── */
  return (
    <SafeAreaView style={styles.safe}>
      <TopTabNavigator />

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="ابحث..."
          placeholderTextColor={Theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          textAlign="right"
        />
        <MaterialIcons
          name="search"
          size={22}
          color={Theme.textSecondary}
          style={styles.searchIcon}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => <CenterCard center={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

/* ───────── Styles ───────── */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  list: {
    padding: Theme.spacing.medium,
  },

  /* Search bar */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Theme.spacing.medium,
    marginBottom: Theme.spacing.small,
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.medium,
    paddingHorizontal: Theme.spacing.small,
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    marginTop:10,
  },
  searchIcon: {
    marginHorizontal: Theme.spacing.tiny,
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.normal,
    color: Theme.textPrimary,
    paddingVertical: Theme.spacing.tiny,
    textAlign: "right"
  },
});
