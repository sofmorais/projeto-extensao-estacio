import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLogs } from '../../src/contexts/LogsContext';
import { api } from '../../src/services/api';
import { Produto } from '../../src/types/produto';

export default function HomeScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState('');
  const [qtd, setQtd] = useState('');
  const [qtdsRemover, setQtdsRemover] = useState<Record<number, string>>({}); // Novo estado para armazenar as quantidades a remover por id
  const { adicionarLog } = useLogs();

  const carregar = async () => {
    try {
      const { data } = await api.get<Produto[]>('/produtos');
      setProdutos(data);
    } catch {
      Alert.alert('Erro', 'Falha ao buscar produtos');
    }
  };

  const adicionar = async () => {
    if (!nome || !qtd) return;
    const existente = produtos.find(p => p.nome.toLowerCase() === nome.toLowerCase());

    try {
      if (existente) {
        await api.put(`/produtos/${existente.id}`, { qtd: existente.qtd + parseInt(qtd) });
      } else {
        await api.post('/produtos', { nome, qtd: parseInt(qtd) });
      }
      setNome('');
      setQtd('');
      carregar();
      adicionarLog(nome, 'Adicionado');
    } catch {
      Alert.alert('Erro', 'Erro ao adicionar produto');
    }
  };

  const remover = async (id: number) => {
    const qtdStr = qtdsRemover[id];
    const removerQtd = parseInt(qtdStr);
    if (!removerQtd || removerQtd <= 0) return;

    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    try {
      await api.put(`/produtos/${id}/remover`, { qtd: removerQtd });
      setQtdsRemover(prev => ({ ...prev, [id]: '' }));
      carregar();
      adicionarLog(produto.nome, 'Removido');

      Alert.alert('Sucesso', 'Remoção realizada com sucesso.');
    } catch {
      Alert.alert('Erro', 'Erro ao remover produto');
    }
  };

  const excluir = async (id: number) => {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    try {
      await api.delete(`/produtos/${id}`);
      carregar();
      adicionarLog(produto.nome, 'Excluído');

      Alert.alert('Sucesso', 'Produto excluído com sucesso.');
    } catch {
      Alert.alert('Erro', 'Erro ao excluir produto');
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gabe - Estoque</Text>
      <TextInput
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantidade"
        value={qtd}
        onChangeText={setQtd}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Adicionar" onPress={adicionar} />

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nome} | Quantidade: {item.qtd}</Text>

            {item.qtd > 0 && (
              <>
                <TextInput
                  placeholder="Qtd a remover"
                  value={qtdsRemover[item.id] || ''}
                  onChangeText={(text) =>
                    setQtdsRemover(prev => ({ ...prev, [item.id]: text }))
                  }
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Button title="Remover" onPress={() => remover(item.id)} />
              </>
            )}

            {item.qtd === 0 && (
              <Button title="Adicionar item" onPress={() => setNome(item.nome)} />
            )}

            <Button
              title="🗑️ Excluir produto"
              color="red"
              onPress={() => excluir(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 4 },
  item: { marginTop: 10, padding: 10, backgroundColor: '#eee', borderRadius: 6 },
});
