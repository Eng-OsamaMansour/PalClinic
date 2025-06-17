import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AppointmentCard from "../components/Home/AppointmentCard";
import {getAppointments} from "../api/appointmnets";
import {cancelAppointment} from "../api/appointmnets";

export default function Home() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments();
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => String(item.appointment.id)}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item.appointment}
              working={workingId === item.appointment.id}
              onCancel={async (id) => {
                try {     
                  setWorkingId(id); 
                  await cancelAppointment(id);
                  setAppointments((prev) =>
                    prev.map((obj) =>
                      obj.appointment.id === id
                        ? {
                            ...obj,
                            appointment: {
                              ...obj.appointment,
                              status: "canceled",
                            },
                          }
                        : obj
                    )
                  );
                } finally {
                  setWorkingId(null);
                }
              }}
            />
          )}
        />
        
      ) : (
        <Text style={styles.noData}>لا يوجد مواعيد</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
