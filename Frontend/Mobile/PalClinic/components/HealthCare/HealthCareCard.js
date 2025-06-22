import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getClinics } from "../../api/Clinics";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Theme } from "../../assets/Theme/Theme1";

const iconMap = {
  "المراكز الصحية": { lib: MaterialCommunityIcons, name: "hospital-marker" },
  "العيادات الخاصة": { lib: MaterialCommunityIcons, name: "stethoscope" },
};

export default function HealthCareCard({ title }) {
  const [Clinics, setClinics] = useState(null);
  const [indvisualClinic, setIndvidsualClinc] = useState(null);
  const [centerClinic, setCenterClinic] = useState(null);
  const navigation = useNavigation();
  const { lib: IconLib, name: iconName } = iconMap[title] ?? {};

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          const C = await getClinics();
          if (!isActive) return;
          setClinics(C);
          const indv = [],
            ctr = [];
          C.forEach((item) => {
            if (item.clinictype === "individual") indv.push(item);
            else if (item.clinictype === "healthcarecenter") ctr.push(item);
          });
          setIndvidsualClinc(indv);
          setCenterClinic(ctr);
        } catch (error) {
          console.log("fetch error:", error);
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handlePress = async () => {
    if (title === "المراكز الصحية") {
      navigation.navigate("HealthCareCenterChooser");
    }
    if (title === "العيادات الخاصة") {
      let data = indvisualClinic;
      navigation.navigate("ClinicsView", {data })
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {IconLib && (
        <IconLib
          name={iconName}
          size={22}
          color={Theme.accent}
          style={styles.leadingIcon}
        />
      )}
      <Text style={styles.title}>{title}</Text>
      <MaterialIcons
        name="chevron-left"
        size={24}
        color={Theme.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.large,
    marginVertical: Theme.spacing.small,
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },

  leadingIcon: {
    marginHorizontal: Theme.spacing.tiny,
  },

  title: {
    flex: 1,
    fontSize: Theme.fontSize.heading,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
    textAlign: "right",
  },
});
