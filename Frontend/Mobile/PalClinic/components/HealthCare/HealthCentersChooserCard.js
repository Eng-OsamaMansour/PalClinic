import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../assets/Theme/Theme1";

/* title → icon */
const iconMap = {
  "المراكز الصحية الحكومية":  { lib: MaterialCommunityIcons, name: "city-variant-outline" },
  "المراكز الصحية الخاصة":   { lib: MaterialCommunityIcons, name: "office-building" },
  "المراكز الصحية غير الربحية": { lib: MaterialCommunityIcons, name: "hand-heart-outline" },
};

export default function HealthCareCenterChooserCard({ title, GOV, NP, PV }) {
  const navigation = useNavigation();
  const { lib: IconLib, name: iconName } = iconMap[title] ?? {};

  const handlePress = () => {
    let data = GOV;
    if (title === "المراكز الصحية الخاصة")        data = PV;
    else if (title === "المراكز الصحية غير الربحية") data = NP;
    navigation.navigate("HealthCentersView", { data });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* leading icon */}
      {IconLib && (
        <IconLib name={iconName} size={22} color={Theme.accent} style={styles.leadingIcon}/>
      )}

      {/* title */}
      <Text style={styles.title}>{title}</Text>

      {/* trailing chevron */}
      <MaterialIcons name="chevron-left" size={24} color={Theme.textSecondary}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row-reverse",          // RTL
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
