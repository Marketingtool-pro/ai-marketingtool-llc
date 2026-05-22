import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';


interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: Date;
  read: boolean;
  type: 'generation' | 'system' | 'promo' | 'update';
}

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    checkPermission();
    loadNotifications();
  }, []);

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPushEnabled(status === 'granted');
  };

  const togglePush = async () => {
    if (!pushEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      setPushEnabled(status === 'granted');
    } else {
      setPushEnabled(false);
    }
  };

  const loadNotifications = async () => {
    const delivered = await Notifications.getPresentedNotificationsAsync();
    const items: NotificationItem[] = delivered.map((n) => ({
      id: n.request.identifier,
      title: n.request.content.title || 'MarketingTool',
      body: n.request.content.body || '',
      date: new Date(n.date),
      read: false,
      type: 'system' as const,
    }));
    setNotifications(items);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismissAll = async () => {
    await Notifications.dismissAllNotificationsAsync();
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'generation': return 'zap';
      case 'promo': return 'gift';
      case 'update': return 'download-cloud';
      default: return 'bell';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.read && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.notifIcon}>
        <Feather name={getIcon(item.type) as any} size={20} color={Colors.accent} />
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifTitle}>{item.title}</Text>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.notifTime}>{formatDate(item.date)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
      <Feather name="chevron-right" size={18} color={Colors.accent} style={{ marginTop: 4 }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={dismissAll} style={styles.clearBtn}>
            <Feather name="trash-2" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Push Toggle - Bento Glass Card */}
      <View style={styles.pushRow}>
        <View style={styles.pushLeft}>
          <View style={styles.pushIcon}>
            <Feather name="bell" size={20} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.pushLabel}>Push Notifications</Text>
            <Text style={styles.pushDesc}>{pushEnabled ? 'Enabled' : 'Tap to enable'}</Text>
          </View>
        </View>
        <Switch
          value={pushEnabled}
          onValueChange={togglePush}
          trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
          thumbColor={pushEnabled ? Colors.accent : Colors.textTertiary}
        />
      </View>

      {/* Email Notifications Toggle */}
      <View style={styles.pushRowSecond}>
        <View style={styles.pushLeft}>
          <View style={styles.pushIcon}>
            <Feather name="mail" size={20} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.pushLabel}>Email Notifications</Text>
            <Text style={styles.pushDesc}>Product updates & offers</Text>
          </View>
        </View>
        <Switch
          value={true}
          trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
          thumbColor={Colors.accent}
        />
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Feather name="bell-off" size={48} color={Colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              {pushEnabled
                ? "You're all caught up!"
                : 'Enable push notifications to stay updated'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0D0F1C',
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  clearBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pushRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 0,
  },
  pushRowSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  pushLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pushIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  pushLabel: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  pushDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  notifBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
