import { ScrollView, Text } from "react-native";
import MedicalProfileCard from "../components/MedicalProfile/MedicalProfileCard";
import { Theme } from "../assets/Theme/Theme1";
import { getMedicalProfile } from "../api/medical_profile";
import { getUser } from "../config/UserManager";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";




import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getClinics } from "../api/Clinics";
export default function HealthCenter() {
  const [HealthCareCenters,setHealthCareCenters] = useState(null);
  const [Clinics,setClinics] = useState(null);
  const [PrivateHealthCareCenters,setPrivateHealthCareCenters] = useState(null);
  const [GOVHealthCareCenters,setGOVHealthCareCenters] = useState(null);
  const [NPHealthCareCenters,setNPHealthCareCenter] = useState(null);

  
  

  return (
      <View>
        <Text>Health Center</Text>
      </View>
  );
}

