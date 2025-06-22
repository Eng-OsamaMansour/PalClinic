import React, { useContext } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { ChatCtx } from "../contexts/ChatContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FAB } from "react-native-paper";
import uuid from "react-native-uuid";
import { createRoom } from "../api/chat";
import { getValidAccessToken } from "../config/ValidAccessToken";
import { Theme } from "../assets/Theme/Theme1";

dayjs.extend(relativeTime);

export default function ChatListScreen({ navigation }) {
  const { rooms, refreshRooms } = useContext(ChatCtx);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ChatScreen", { room: item })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarTxt}>
          {item.name.startsWith("assist-") ? "🤖" : item.name[0]}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.title}>
          {item.name.startsWith("assist-") ? "المساعد الطبي" : item.name}
        </Text>
        {item.last_message && (
          <Text style={styles.preview} numberOfLines={1}>
            {item.last_message.body} ·{" "}
            {dayjs(item.last_message.created_at).fromNow()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  /* new AI assistant room */
  const handleNewAI = async () => {
    const tokenPayload = JSON.parse(
      atob((await getValidAccessToken()).split(".")[1])
    );
    const uid = tokenPayload.user_id;
    const name = `assist-${uid}-${uuid.v4().slice(0, 8)}`;

    const room = await createRoom(name);
    await refreshRooms();
    navigation.navigate("ChatScreen", { room });
  };

  return (
    <>
      <FlatList
        data={rooms}
        keyExtractor={(r) => String(r.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleNewAI}
        color={Theme.textInverse}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: Theme.spacing.medium },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Theme.spacing.medium,
    marginBottom: Theme.spacing.small,
    backgroundColor: Theme.cardBackground,
    borderRadius: Theme.borderRadius.medium,
    shadowColor: Theme.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Theme.spacing.medium,
  },
  avatarTxt: { fontSize: 28 },
  meta: { flex: 1 },
  title: {
    fontSize: Theme.fontSize.heading,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
  },
  preview: {
    fontSize: Theme.fontSize.small,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    backgroundColor: Theme.accent,
  },
});
