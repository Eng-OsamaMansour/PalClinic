import React, { useContext, useCallback } from "react";
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text } from "react-native";
import NotificationCard from "../components/Notifications/NotificationsCard";
import { NotificationCtx } from "../contexts/NotificationContext";
import { Theme } from "../assets/Theme/Theme1";

export default function Notifications() {
  const { items, loadInitial, markAsRead } = useContext(NotificationCtx);

  const renderItem = ({ item }) => (
    <NotificationCard
      data={item}
      onPress={() => markAsRead(item.id)}
    />
  );

    return (
    <SafeAreaView style={styles.safe}>

      {items.length === 0 ? (
        <Text style={styles.noData}>لا توجد إشعارات</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl colors={[Theme.accent]} refreshing={false} onRefresh={loadInitial} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.background },
  list: { padding: Theme.spacing.medium },
  noData: {
    textAlign: "center",
    marginTop: Theme.spacing.large,
    fontSize: Theme.fontSize.normal,
    color: Theme.textSecondary,
  },
});
