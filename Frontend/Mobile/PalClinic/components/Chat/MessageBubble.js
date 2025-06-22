import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Theme } from "../../assets/Theme/Theme1";
import dayjs from "dayjs";

export default function MessageBubble({ msg, isMine, showDate }) {
  return (
    <>
      {showDate && (
        <View style={styles.dayWrap}>
          <Text style={styles.dayTxt}>
            {dayjs(msg.created_at).format("DD MMMM YYYY")}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.wrap,
          isMine ? styles.mine : styles.theirs,
          isMine ? styles.tailRight : styles.tailLeft,
        ]}
      >
        <Text style={styles.body}>{msg.body}</Text>
        <Text style={styles.time}>
          {dayjs(msg.created_at).format("HH:mm")}
        </Text>
      </View>
    </>
  );
}

const tailSize = 6;

const styles = StyleSheet.create({
  dayWrap: {
    alignSelf: "center",
    backgroundColor: Theme.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginVertical: 6,
  },
  dayTxt: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.textSecondary,
  },
  wrap: {
    maxWidth: "80%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 3,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: Theme.primaryLight,
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: Theme.cardBackground,
  },
  tailRight: {
    borderBottomRightRadius: 2,
    marginRight: tailSize,
  },
  tailLeft: {
    borderBottomLeftRadius: 2,
    marginLeft: tailSize,
  },
  body: {
    color: Theme.textPrimary,
    fontSize: Theme.fontSize.normal,
  },
  time: {
    fontSize: Theme.fontSize.tiny,
    color: Theme.textSecondary,
    alignSelf: "flex-end",
    marginTop: 2,
  },
});
