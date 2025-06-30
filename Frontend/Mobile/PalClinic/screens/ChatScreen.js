import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";   
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import uuid from "react-native-uuid";
import dayjs from "dayjs";

import { ChatCtx } from "../contexts/ChatContext";
import { listMessages, sendMessageREST } from "../api/chat";
import MessageBubble from "../components/Chat/MessageBubble";
import { getValidAccessToken } from "../config/ValidAccessToken";
import { Theme } from "../assets/Theme/Theme1";

export default function ChatScreen({ route }) {
  const insets = useSafeAreaInsets();                 
  const { room } = route.params;

  const {
    messages,
    openSocket,
    loadFirstPage,
    prependOlderMessages,
    sendWS,
  } = useContext(ChatCtx);

  const roomMsgs = messages[room.name] || [];

  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState(null);

  /* decode uid once */
  useEffect(() => {
    (async () => {
      const token = await getValidAccessToken();
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.user_id);
    })();
  }, []);

  /* socket + first page */
  useEffect(() => {
    let socket;
    (async () => {
      socket = await openSocket(room.name);
      await loadFirstPage(room.id, room.name);
    })();
    return () => socket?.close();
  }, []);

  /* pagination */
  const fetchNext = useCallback(async () => {
    const next = page + 1;
    const data = await listMessages(room.id, next);
    const batch = Array.isArray(data)
      ? data.reverse()
      : (data.results || []).reverse();

    if (batch.length) {
      prependOlderMessages(room.name, batch);
      setPage(next);
    }
  }, [page]);

  /* send handler */
  const handleSend = async () => {
    const body = input.trim();
    if (!body) return;
    setInput("");

    const optimistic = {
      id: `temp-${uuid.v4()}`,
      author: userId,
      body,
      created_at: new Date().toISOString(),
    };

    if (!sendWS(room.name, body, optimistic)) {
      await sendMessageREST(room.id, body);
    }
  };

  /* render bubble with date separators */
  const renderItem = ({ item, index }) => {
    const prev = roomMsgs[index + 1];
    const showDate =
      !prev || !dayjs(prev.created_at).isSame(item.created_at, "day");

    return (
      <MessageBubble
        msg={item}
        isMine={item.author === userId}
        showDate={showDate}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 60}
    >
      {/* whole screen inside the avoiding view */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={roomMsgs}
          keyExtractor={(m) => String(m.id)}
          renderItem={renderItem}
          inverted
          onEndReached={fetchNext}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />

        {/* composer */}
        <View
          style={[
            styles.composer,
            { paddingBottom: insets.bottom || 8 },      // ← NEW
          ]}
        >
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="اكتب رسالتك…"
            placeholderTextColor={Theme.textSecondary}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              { opacity: input.trim() ? 1 : 0.3 },
            ]}
            disabled={!input.trim()}
            onPress={handleSend}
          >
            <MaterialCommunityIcons
              name="send"
              size={22}
              color={Theme.textInverse}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  list: { padding: Theme.spacing.medium },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Theme.spacing.small,
    paddingTop: Theme.spacing.small,
    borderTopWidth: 0.5,
    borderColor: Theme.border,
    backgroundColor: Theme.background,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.borderRadius.medium,
    padding: Theme.spacing.small,
    fontSize: Theme.fontSize.normal,
    color: Theme.textPrimary,
  },
  sendBtn: {
    backgroundColor: Theme.accent,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Theme.spacing.small,
  },
});
