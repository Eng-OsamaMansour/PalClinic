import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../assets/Theme/Theme1";
import { Linking, Platform } from "react-native";
import { getHealthCareCenterClinics } from "../../api/HealthCareCenters";
import { useNavigation } from "@react-navigation/native";

const badgeInfo = {
  Goverment: { color: Theme.primary, icon: "city-variant-outline" },
  Pricvate: { color: Theme.accent, icon: "office-building" },
  "None-Profit": { color: Theme.success, icon: "hand-heart-outline" },
};

const parsePoint = (str) => {
  try {
    const match = str.match(/\(([-\d.]+) ([-\d.]+)\)/);
    if (match) return { lon: Number(match[1]), lat: Number(match[2]) };
  } catch (_) {}
  return null;
};

export default function CenterCard({ center, onPress = () => {} }) {
  const { color, icon } = badgeInfo[center.centerType] ?? {};
  const navigator = useNavigation();

  const handleMapPress = () => {
    const coords = parsePoint(center.location);
    if (!coords) return;
    const { lat, lon } = coords;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) return Linking.openURL(url);
        // Fallback to geo URI (most Android devices support it)
        const geo = Platform.select({
          ios: `maps:${lat},${lon}`,
          android: `geo:${lat},${lon}`,
        });
        return Linking.openURL(geo);
      })
      .catch((err) => console.warn("Failed to open map:", err));
  };

  const handlePress = async () => {
    const data = await getHealthCareCenterClinics(center.id);
    navigator.navigate("ClinicsView" , {data})
    
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      {/* ── Header row ─────────────────────────────────────── */}
      <View style={styles.headerRow}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={Theme.accent}
            style={styles.icon}
          />
        )}
        <Text style={styles.name}>{center.name}</Text>

        <View style={[styles.typeBadge, { backgroundColor: color }]}>
          <Text style={styles.typeText}>{center.centerType}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="map-marker"
          size={18}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{center.address}</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="phone"
          size={18}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{center.phoneNumber}</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="email-outline"
          size={18}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{center.email}</Text>
      </View>

      {center.discrption && (
        <Text style={styles.description}>{center.discrption}</Text>
      )}

      <TouchableOpacity style={styles.mapBtn} onPress={handleMapPress}>
        <MaterialCommunityIcons
          name="map-search-outline"
          size={18}
          color={Theme.textInverse}
        />
        <Text style={styles.mapText}>عرض على الخريطة</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.large,
    padding: Theme.spacing.medium,
    marginBottom: Theme.spacing.medium,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    alignItems: "flex-end",
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.small,
    alignSelf: "flex-end",
  },
  icon: { marginHorizontal: Theme.spacing.tiny },
  name: {
    flex: 1,
    fontSize: Theme.fontSize.heading,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
    textAlign: "right",
  },
  typeBadge: {
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
    marginLeft: Theme.spacing.tiny,
  },
  typeText: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.textInverse,
    fontWeight: Theme.fontWeight.medium,
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.tiny,
    alignSelf: "flex-end",
  },
  infoText: {
    fontSize: Theme.fontSize.small,
    color: Theme.textSecondary,
    textAlign: "right",
    marginLeft: Theme.spacing.tiny,
    lineHeight: 18,
  },
  description: {
    fontSize: Theme.fontSize.small,
    color: Theme.textPrimary,
    textAlign: "right",
    marginTop: Theme.spacing.small,
    lineHeight: 20,
  },

  /* map button */
  mapBtn: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: Theme.accent,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
    marginTop: Theme.spacing.small,
    alignSelf: "flex-end",
  },
  mapText: {
    color: Theme.textInverse,
    marginHorizontal: Theme.spacing.tiny,
    fontSize: Theme.fontSize.small,
    fontWeight: Theme.fontWeight.medium,
  },
});
