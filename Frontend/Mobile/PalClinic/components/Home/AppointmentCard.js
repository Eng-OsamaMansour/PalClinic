// components/AppointmentCard.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../assets/Theme/Theme1';

/**
 * @param {object}   appointment   full appointment object
 * @param {boolean}  working       show spinner while API call runs
 * @param {Function} onCancel      async fn → await onCancel(id)
 */
export default function AppointmentCard({ appointment, working, onCancel }) {
  const statusText =
    appointment.status === 'completed'
      ? 'منجز'
      : appointment.status === 'canceled'
      ? 'ملغى'
      : 'قيد الانتظار';

  const statusColor =
    appointment.status === 'completed'
      ? Theme.success
      : appointment.status === 'canceled'
      ? Theme.danger
      : Theme.warning;

  const canCancel = appointment.status === 'pending' && !working;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.idText}>#{appointment.id}</Text>
        <Text style={[styles.status, { color: statusColor }]}>
          {statusText}
        </Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={16} color={Theme.textSecondary} />
        <Text style={styles.infoText}>{appointment.date}</Text>
        <Ionicons
          name="time-outline"
          size={16}
          color={Theme.textSecondary}
          style={{ marginStart: Theme.spacing.medium }}
        />
        <Text style={styles.infoText}>{appointment.time.slice(0, 5)}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="medkit-outline" size={16} color={Theme.textSecondary} />
        <Text style={styles.infoText}>{appointment.doctor_name}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="business-outline" size={16} color={Theme.textSecondary} />
        <Text style={styles.infoText}>{appointment.clinic_name}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: canCancel ? Theme.danger : Theme.disabled,
          },
        ]}
        disabled={!canCancel}
        onPress={() => onCancel?.(appointment.id)}
      >
        {working ? (
          <ActivityIndicator color={Theme.textInverse} />
        ) : (
          <Text style={styles.btnText}>
            {appointment.status === 'pending' ? 'إلغاء الموعد' : 'غير متاح'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: Theme.primaryLight,
    borderRadius: Theme.borderRadius.medium,
    padding: Theme.spacing.medium,
    marginVertical: Theme.spacing.small,
    // subtle shadow
    shadowColor: Theme.shadow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: Theme.spacing.tiny,
  },
  idText: {
    fontWeight: Theme.fontWeight.bold,
    color: Theme.textPrimary,
    fontSize: Theme.fontSize.heading,
    marginStart: Theme.spacing.small,
  },
  status: {
    fontWeight: Theme.fontWeight.medium,
    fontSize: Theme.fontSize.small,
  },
  infoText: {
    fontSize: Theme.fontSize.small,
    color: Theme.textSecondary,
    marginStart: Theme.spacing.tiny,
  },
  btn: {
    marginTop: Theme.spacing.medium,
    paddingVertical: Theme.spacing.small,
    borderRadius: Theme.borderRadius.small,
    alignItems: 'center',
  },
  btnText: {
    color: Theme.textInverse,
    fontWeight: Theme.fontWeight.bold,
    fontSize: Theme.fontSize.normal,
  },
});
