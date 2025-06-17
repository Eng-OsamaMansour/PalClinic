import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import TopTabNavigator from "../../components/Structure/TopSecNav";
import LabTestCard from "../../components/MedicalProfile/LabTestCard";
import { Theme } from "../../assets/Theme/Theme1";
import { useMemo } from "react";

export default function LabTest() {
  const { params } = useRoute();
  const data = params?.data ?? [];

  const sorted = useMemo(
    () => [...data].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [data]
  );
  return (
    <SafeAreaView style={styles.safe}>
      <TopTabNavigator />

      {sorted.length === 0 ? (
        <Text style={styles.noData}>لا توجد تحاليل مخبرية</Text>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({ item }) => <LabTestCard test={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.background },
  list: { padding: Theme.spacing.medium },
  noData: {
    textAlign: "center",
    marginTop: Theme.spacing.large,
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
  },
});
