import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopTabNavigator from "../../components/Structure/TopSecNav";
import HealthCareCenterChooserCard from "../../components/HealthCare/HealthCentersChooserCard";
import { getHealthCareCenters } from "../../api/HealthCareCenters";
import { Theme } from "../../assets/Theme/Theme1";

export default function HealthCenterChooser() {
  const [PrivateHealthCareCenters, setPrivate] = useState(null);
  const [GOVHealthCareCenters, setGov] = useState(null);
  const [NPHealthCareCenters,  setNP]  = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          const all = await getHealthCareCenters();
          if (!isActive) return;
          const gov = [], prv = [], np = [];
          all.forEach(item => {
            switch (item.centerType) {
              case "Goverment":   gov.push(item); break;
              case "Pricvate":    prv.push(item); break;
              case "None-Profit": np.push(item);  break;
            }
          });
          setGov(gov); setPrivate(prv); setNP(np);
        } catch (e) {
          console.log("fetch error:", e);
        }
      };
      fetchData();
      return () => { isActive = false; };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <TopTabNavigator />
      <ScrollView contentContainerStyle={styles.list}>
        <HealthCareCenterChooserCard title="المراكز الصحية الحكومية"   GOV={GOVHealthCareCenters} NP={NPHealthCareCenters} PV={PrivateHealthCareCenters}/>
        <HealthCareCenterChooserCard title="المراكز الصحية الخاصة"    GOV={GOVHealthCareCenters} NP={NPHealthCareCenters} PV={PrivateHealthCareCenters}/>
        <HealthCareCenterChooserCard title="المراكز الصحية غير الربحية" GOV={GOVHealthCareCenters} NP={NPHealthCareCenters} PV={PrivateHealthCareCenters}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.background },
  list: { padding: Theme.spacing.medium },
});
