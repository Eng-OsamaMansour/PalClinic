// components/Clinics/ClinicCard.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Linking,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../../assets/Theme/Theme1";
import { useNavigation } from "@react-navigation/native";

/* helper: parse "SRID=4326;POINT (lon lat)" */
const parsePoint = (str = "") => {
  const m = str.match(/\(([-\d.]+) ([-\d.]+)\)/);
  return m ? { lon: +m[1], lat: +m[2] } : null;
};

export default function ClinicCard({ clinic }) {
  /* map handler */
  const navigator = useNavigation();
  const handleMapPress = () => {
    const coords = parsePoint(clinic.location);
    if (!coords) return;
    const { lat, lon } = coords;
    const gmaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    Linking.canOpenURL(gmaps)
      .then((ok) =>
        ok
          ? Linking.openURL(gmaps)
          : Linking.openURL(
              Platform.select({
                ios: `maps:${lat},${lon}`,
                android: `geo:${lat},${lon}`,
              })
            )
      )
      .catch((e) => console.warn("Map open failed:", e));
  };

  /* appointments handler (stub) */
  const handleAppointmentsPress = () => {
    navigator.navigate("AppointmentsView", {clinic})
  };

  /* render hours */
  const renderHours = () =>
    clinic.operating_hours && (
      <View style={styles.hoursBox}>
        <View style={styles.hoursHeaderRow}>
          <MaterialCommunityIcons
            name="clock-time-four-outline"
            size={18}
            color={Theme.accent}
            style={styles.icon}
          />
          <Text style={styles.hoursHeader}>ساعات العمل</Text>
        </View>

        {Object.entries(clinic.operating_hours).map(([day, hrs]) => (
          <View style={styles.hoursRow} key={day}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.hours}>{hrs}</Text>
          </View>
        ))}
      </View>
    );

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name="hospital-building"
          size={20}
          color={Theme.accent}
          style={styles.icon}
        />
        <Text style={styles.name}>{clinic.name}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{clinic.clinictype}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="map-marker"
          size={18}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{clinic.address}</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="phone"
          size={18}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{clinic.phoneNumber}</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="email-outline"
          size={18}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{clinic.email}</Text>
      </View>

      {clinic.specialties && (
        <Text style={styles.description}>التخصصات: {clinic.specialties}</Text>
      )}

      {/* Operating hours */}
      {renderHours()}

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.appBtn}
          onPress={handleAppointmentsPress}
        >
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={18}
            color={Theme.textInverse}
          />
          <Text style={styles.appText}>المواعيد المتاحة</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapBtn} onPress={handleMapPress}>
          <MaterialCommunityIcons
            name="map-search-outline"
            size={18}
            color={Theme.textInverse}
          />
          <Text style={styles.mapText}>عرض على الخريطة</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: Theme.primary,
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

  hoursBox: {
    backgroundColor: Theme.primaryLight,
    borderRadius: Theme.borderRadius.medium,
    padding: Theme.spacing.small,
    marginTop: Theme.spacing.small,
    alignSelf: "stretch",
  },
  hoursHeaderRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: Theme.spacing.tiny,
  },
  hoursHeader: {
    fontSize: Theme.fontSize.small,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.primary,
    textAlign: "right",
  },
  hoursRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  day: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.textPrimary,
    fontWeight: Theme.fontWeight.medium,
  },
  hours: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.textSecondary,
  },
  btnRow: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    marginTop: Theme.spacing.small,
    gap: Theme.spacing.large * 3.5,
    alignSelf: "flex-end",
  },

  appBtn: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: Theme.accent,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
  },
  appText: {
    color: Theme.textInverse,
    marginHorizontal: Theme.spacing.tiny,
    fontSize: Theme.fontSize.small,
    fontWeight: Theme.fontWeight.medium,
  },

  mapBtn: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: Theme.accent,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.small,
    paddingVertical: Theme.spacing.tiny,
  },
  mapText: {
    color: Theme.textInverse,
    marginHorizontal: Theme.spacing.tiny,
    fontSize: Theme.fontSize.small,
    fontWeight: Theme.fontWeight.medium,
  },
});
