import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../assets/Theme/Theme1";

const iconMap = {
  "المعلومات الأساسية":   { lib: MaterialCommunityIcons, name: "account-box-outline" },
  "العمليات الجراحية":   { lib: MaterialCommunityIcons, name: "knife" }, 
  "التحاليل المخبرية":   { lib: MaterialCommunityIcons, name: "flask" },
  "الوصفات الطبية":      { lib: MaterialCommunityIcons, name: "pill" },
  "ملاحظات الأطباء":     { lib: MaterialCommunityIcons, name: "note-text" },
};

export default function MedicalProfileCard({ title, data }) {
  const navigation = useNavigation();
  const { lib: IconLib, name: iconName } = iconMap[title] ?? {};

  const handlePress = () => {
    if (title === "المعلومات الأساسية")      navigation.navigate("BasicInfo",  { data });
    else if (title === "العمليات الجراحية")  navigation.navigate("Surgeries",  { data });
    else if (title === "التحاليل المخبرية")  navigation.navigate("LabTest",    { data });
    else if (title === "الوصفات الطبية")     navigation.navigate("Treatment",  { data });
    else if (title === "ملاحظات الأطباء")    navigation.navigate("DoctorNote", { data });
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

/*───────────────────────────────────────────────────────────────────────────────
  Styles
───────────────────────────────────────────────────────────────────────────────*/
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
