import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import SurgeryCard from "../../components/MedicalProfile/SurgeryCard";
import TopTabNavigator from "../../components/Structure/TopSecNav";
import { Theme } from "../../assets/Theme/Theme1";

export default function Surgeries() {
  const { params } = useRoute();
  const data = params?.data ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <TopTabNavigator />

      {data.length === 0 ? (
        <Text style={styles.noData}>لا توجد عمليات جراحية</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({ item }) => <SurgeryCard surgery={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  list: {
    padding: Theme.spacing.medium,
  },
  noData: {
    textAlign: "center",
    marginTop: Theme.spacing.large,
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
  },
});
