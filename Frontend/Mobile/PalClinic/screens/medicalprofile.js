import { ScrollView, Text } from "react-native";
import MedicalProfileCard from "../components/MedicalProfile/MedicalProfileCard";
import { Theme } from "../assets/Theme/Theme1";
import { getMedicalProfile } from "../api/medical_profile";
import { getUser } from "../config/UserManager";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export default function MedicalProfile() {
  const [basicInfo, setBasicInfo] = useState(null);
  const [surgeries, setSurgeries] = useState(null);
  const [labTests, setLabTests] = useState(null);
  const [treatments, setTreatments] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchMedicalProfile = async () => {
        try {
          const { id } = await getUser();
          const data = await getMedicalProfile(id);
          if (!isActive) return;
          setBasicInfo(data.basic_info);
          setSurgeries(data.surgeries);
          setLabTests(data.lab_tests);
          setTreatments(data.treatments);
          setDoctorNotes(data.doctor_notes);
        } catch (err) {
          console.error("Error fetching medical profile:", err);
        }
      };
      fetchMedicalProfile();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <MedicalProfileCard title="المعلومات الأساسية" data={basicInfo} />
      <MedicalProfileCard title="العمليات الجراحية" data={surgeries} />
      <MedicalProfileCard title="التحاليل المخبرية" data={labTests} />
      <MedicalProfileCard title="الوصفات الطبية" data={treatments} />
      <MedicalProfileCard title="ملاحظات الأطباء" data={doctorNotes} />
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
