// screens/AppointmentsView.js
import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  I18nManager,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import TopTabNavigator from "../../components/Structure/TopSecNav";
import { getClinicAppointments } from "../../api/appointmnets";
import AppointmentBookingCard from "../../components/Appointments/AppointmentBookingCard";
import { Theme } from "../../assets/Theme/Theme1";

export default function AppointmentsView() {
  const { params } = useRoute();
  const clinic = params?.clinic ?? {};
  const clinic_id = clinic.id;

  const [rawAppts, setRawAppts] = useState([]);
  const [query, setQuery] = useState("");


  /* ─── Fetch once on focus ─── */
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          const A = await getClinicAppointments(clinic_id);
          if (isActive) {
            // keep only available appointments
            setRawAppts(A.filter((a) => a.available));
          }
        } catch (e) {
          console.log("fetch error:", e);
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [clinic_id])
  );

  /* ─── Derived list after search ─── */
  const filtered = useMemo(() => {
    if (!query.trim()) return rawAppts;
    const q = query.trim().toLowerCase();
    return rawAppts.filter(
      (a) =>
        a.date.toLowerCase().includes(q) || a.time.toLowerCase().includes(q)
    );
  }, [query, rawAppts]);

  /* ─── UI ─── */
  return (
    <SafeAreaView style={styles.safe}>
      <TopTabNavigator />

      {/* search bar */}
      <View style={styles.searchBar}>
        <MaterialIcons
          name="search"
          size={22}
          color={Theme.textSecondary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="ابحث بالتاريخ أو الوقت..."
          placeholderTextColor={Theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          textAlign={"right"}
        />
      </View>

      {/* list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <AppointmentBookingCard
            appointment={item}
            onBook={(appt) => {
              /* TODO: open booking flow */
              console.log("Book pressed:", appt.id);
            }}
          />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.background },
  list: { padding: Theme.spacing.medium },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Theme.spacing.medium,
    marginBottom: Theme.spacing.small,
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.medium,
    paddingHorizontal: Theme.spacing.small,
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    marginTop: 20,
  },
  icon: { marginHorizontal: Theme.spacing.tiny },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.normal,
    color: Theme.textPrimary,
    paddingVertical: Theme.spacing.tiny,
  },
});
