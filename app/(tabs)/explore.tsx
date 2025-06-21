import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLogs } from '../../src/contexts/LogsContext';

export default function TabTwoScreen() {
  const { logs } = useLogs();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Ações</Text> 
      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text style={styles.logText}>
              [{item.data}] {item.produto} - {item.acao}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma ação registrada ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  logItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  logText: { fontSize: 16 },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#888',
  },
});
