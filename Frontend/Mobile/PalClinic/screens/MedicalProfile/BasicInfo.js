import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../assets/Theme/Theme1";
import TopTabNavigator from "../../components/Structure/TopSecNav";
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowTextWrapper}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? "—"}</Text>
    </View>
    <MaterialCommunityIcons
      name={icon}
      size={40}
      color={Theme.accent}
      style={styles.rowIcon}
    />
  </View>
);

export default function BasicInfo() {
  const { params } = useRoute();
  const data = params?.data ?? {};

  return (
    <>
      <SafeAreaView style={{ backgroundColor: Theme.background }}>
        <TopTabNavigator />
      </SafeAreaView>

      <View style={styles.safe}>
        <View style={styles.card}>
          <Text style={styles.title}>المعلومات الأساسية</Text>
          <InfoRow
            icon="cake-variant"
            label="العمر"
            value={`${data.age} سنة`}
          />
          <InfoRow icon="human" label="الجنس" value={data.gender} />
          <InfoRow
            icon="blood-bag"
            label="فصيلة الدم"
            value={data.blood_type}
          />
          <InfoRow icon="ruler" label="الطول" value={`${data.height} م`} />
          <InfoRow
            icon="weight-kilogram"
            label="الوزن"
            value={`${data.weight} كغ`}
          />
          <InfoRow icon="needle" label="الحساسيات" value={data.allergies} />
          <InfoRow
            icon="heart-pulse"
            label="الأمراض المزمنة"
            value={data.chronic_conditions}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    flexDirection: "column",

    backgroundColor: Theme.background,
    padding: Theme.spacing.medium,
  },
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.large,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: Theme.fontSize.heading,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.primary,
    marginBottom: Theme.spacing.medium,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
  },
  rowIcon: {
    marginLeft: Theme.spacing.medium,
  },
  rowTextWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
    paddingBottom: Theme.spacing.tiny,
    alignItems: "right",
  },
  rowLabel: {
    fontSize: Theme.fontSize.small,
    color: Theme.textSecondary,
    textAlign: "right",
  },
  rowValue: {
    fontSize: Theme.fontSize.normal,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.textPrimary,
    marginTop: 2,
    textAlign: "right",
  },
});
