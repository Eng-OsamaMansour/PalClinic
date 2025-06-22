import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  I18nManager,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import TopTabNavigator from "../../components/Structure/TopSecNav";
import ClinicCard from "../../components/Clinics/ClinicCard";
import { Theme } from "../../assets/Theme/Theme1";

export default function ClinicsView() {

  const { params } = useRoute();
  const data = params?.data ?? [];


  const [query, setQuery] = useState("");


  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((c) =>
      [
        c.name,
        c.specialties,
        c.address,
        c.email,
        c.phoneNumber,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [query, data]);

  return (
    <SafeAreaView style={styles.safe}>
      <TopTabNavigator />

      {/* search */}
      <View style={styles.searchBar}>
        <MaterialIcons
          name="search"
          size={22}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="ابحث..."
          placeholderTextColor={Theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          textAlign={"right" }
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => <ClinicCard clinic={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.background },
  list: { padding: Theme.spacing.medium },

  searchBar: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
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
    marginTop:20,
  },
  icon: { marginHorizontal: Theme.spacing.tiny },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.normal,
    color: Theme.textPrimary,
    paddingVertical: Theme.spacing.tiny,
    textAlign:"right"
  },
});
