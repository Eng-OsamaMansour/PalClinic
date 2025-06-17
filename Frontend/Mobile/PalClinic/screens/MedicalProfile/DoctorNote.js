import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import TopTabNavigator from "../../components/Structure/TopSecNav";
import DoctorNoteCard from "../../components/MedicalProfile/DoctorNoteCard";
import { Theme } from "../../assets/Theme/Theme1";

export default function DoctorNote() {
  const { params } = useRoute();
  const raw = params?.data ?? [];

  const sorted = useMemo(
    () =>
      [...raw].sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      ),
    [raw]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <TopTabNavigator />

      {sorted.length === 0 ? (
        <Text style={styles.noData}>لا توجد ملاحظات طبية</Text>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({ item }) => <DoctorNoteCard note={item} />}
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
