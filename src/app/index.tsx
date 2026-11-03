import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PetView } from '@/components/PetView';
import {
  DAILY_GOAL_ML,
  MIN_COIN_STAGE,
  STAGES,
  getNextStage,
  getStage
} from '@/constants/pet';
import { useGameStore } from '@/store/useGameStore';

export default function HomeScreen() {
  const intakeToday = useGameStore((s) => s.intakeToday);
  const growthPoints = useGameStore((s) => s.growthPoints);
  const coins = useGameStore((s) => s.coins);
  const addWater = useGameStore((s) => s.addWater);
  const checkNewDay = useGameStore((s) => s.checkNewDay);

  useEffect(() => {
    checkNewDay();

  }, [checkNewDay]);

  const stage = getStage(growthPoints);
  const next = getNextStage(growthPoints);

  const dailyProgress = Math.min((intakeToday / DAILY_GOAL_ML) * 100, 100);
  const growthProgress = next
    ? ((growthPoints - stage.minGrowth) / (next.minGrowth - stage.minGrowth)) * 100
    : 100;

  const handleAdd = (ml: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { leveledUp } = addWater(ml);
    if (leveledUp) {
      const newStage = getStage(growthPoints + Math.round(ml / 50));
      Alert.alert('Your pet grew! 🎉', `Now a ${newStage.name}!`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* coins */}
      <View style={styles.topBar}>
        <Text style={styles.coinText}>
          {stage.level >= MIN_COIN_STAGE
            ? `🪙 ${coins}`
            : `🔒 Coins unlock at ${STAGES[MIN_COIN_STAGE - 1].name}`}
        </Text>
      </View>

      {/* Pet */}
      <PetView emoji={stage.emoji} bounceKey={growthPoints} />
      <Text style={styles.petName}>Pip the {stage.name}</Text>

      {/* Growth Bar */}
      <View style={styles.barBlock}>
        <View style={styles.track}>
          <View
            style={[styles.fill, {width: `${growthProgress}%`, backgroundColor: '#a78bfa'}]}
          />
        </View>
        <Text style={styles.barLabel}>
          {next ? `Growing to ${next.name}` : 'Fully grown!'}
        </Text>
      </View>

      {/* Daily Water */}
      <Text style={styles.intakeText}>{intakeToday} ml</Text>
      <Text style={styles.goalText}>of {DAILY_GOAL_ML} ml today</Text>
      <View style={styles.barBlock}>
        <View style={styles.track}>
          <View
            style={[styles.fill, {width: `${dailyProgress}%`, backgroundColor: '#38bdf8'}]}
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => handleAdd(250)}>
          <Text style={styles.buttonText}>+ 250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleAdd(500)}>
          <Text style={styles.buttonText}>+ 500ml</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    padding: 20,
  },
  topBar: { width: '100%', alignItems: 'flex-end', marginBottom: 12 },
  coinText: { color: '#fbbf24', fontSize: 18, fontWeight: 'bold', },
  petName: { color: '#f8fafc', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  barBlock: { width: '100%', maxWidth: 400, marginBottom: 20 },
  track: {
    width: '100%',
    height: 12,
    backgroundColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: { height: '100%' },
  barLabel: { color: '#94a3b8', fontSize: 13, marginTop: 6, textAlign: 'center'},
  intakeText: { color: '#38bdf8', fontSize: 48, fontWeight: 'bold' },
  goalText: { color: '#94a3b8', fontSize: 16, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', width: '100%', maxWidth: 400 },
  button: {
    flex: 1,
    backgroundColor: '#0284c7',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});