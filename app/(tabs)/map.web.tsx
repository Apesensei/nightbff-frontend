import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapWeb() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map View (Web)</Text>
      <Text style={styles.subtitle}>Interactive map is available in the mobile app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 14, opacity: 0.7 },
});
