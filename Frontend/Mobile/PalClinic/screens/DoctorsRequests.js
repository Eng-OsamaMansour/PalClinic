import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Theme } from "../assets/Theme/Theme1";
import RequestCard from "../components/DoctorsRequests/RequsetCard";
import { deleteRequest, getDoctorsRequsets } from "../api/DoctorsRequests";
import { updateRequest } from "../api/DoctorsRequests";
import { showMessage } from "react-native-flash-message";

export default function DoctorRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | inactive

  const fetchRequests = useCallback(async () => {
    try {
      const data = await getDoctorsRequsets();
      setRequests(data);
    } catch (err) {
      console.log("fetch error:", err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests])
  );

  /* derived list */
  const visible = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((r) =>
      filter === "active" ? r.is_active : !r.is_active
    );
  }, [filter, requests]);

  /* empty handlers */
  const updater = async (request) => {
    const response = await updateRequest(request);

    if (response.ok) {
      showMessage({
        message: "نجاح",
        description: "تم التحديث",
        type: "success",
        backgroundColor: "#45D645",
        color: "white",
      });
      fetchRequests();
    }
  };

  const deleter = async (request) => {
    const response = await deleteRequest(request);
    if (response.ok) {
      showMessage({
        message: "نجاح",
        description: "تم الحذف",
        type: "success",
        backgroundColor: "#45D645",
        color: "white",
      });
      fetchRequests();
    }
  };

  /* chip component */
  const Chip = ({ id, label }) => (
    <TouchableOpacity
      style={[styles.chip, filter === id && styles.chipActive]}
      onPress={() => setFilter(id)}
    >
      <Text style={[styles.chipTxt, filter === id && styles.chipTxtActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* filter bar */}
      <View style={styles.filters}>
        <Chip id="all" label="الكل" />
        <Chip id="active" label="النشطة" />
        <Chip id="inactive" label="غير النشطة" />
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item, idx) => `${item.created_at}-${idx}`}
        renderItem={({ item }) => (
          <RequestCard request={item} onDelete={deleter} onToggle={updater} />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.background },
  filters: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    marginVertical: Theme.spacing.small,
  },
  chip: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.borderRadius.small,
    paddingHorizontal: Theme.spacing.medium,
    paddingVertical: Theme.spacing.tiny,
    marginHorizontal: Theme.spacing.tiny,
    backgroundColor: Theme.cardBackground,
  },
  chipActive: {
    backgroundColor: Theme.accent,
    borderColor: Theme.accent,
  },
  chipTxt: {
    fontSize: Theme.fontSize.small,
    color: Theme.textPrimary,
  },
  chipTxtActive: {
    color: Theme.textInverse,
    fontWeight: Theme.fontWeight.medium,
  },
  list: { padding: Theme.spacing.medium },
});
