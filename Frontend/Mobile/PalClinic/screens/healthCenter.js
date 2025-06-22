import { ScrollView } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getHealthCareCenters } from "../api/HealthCareCenters";
import { getClinics } from "../api/Clinics";
import HealthCareCard from "../components/HealthCare/HealthCareCard";
import { Theme } from "../assets/Theme/Theme1";
import TopTabNavigator from "../components/Structure/TopSecNav";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HealthCenter() {
  return (
  
      <ScrollView style={styles.container}>
        <HealthCareCard title={"المراكز الصحية"}></HealthCareCard>
        <HealthCareCard title={"العيادات الخاصة"}></HealthCareCard>
      </ScrollView>
    
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Theme.background,
    padding: Theme.spacing.medium,
  },
};
