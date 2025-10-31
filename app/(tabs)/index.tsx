import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const COFFEE_MENU: Product[] = [
  {
    id: '1',
    name: 'Espresso',
    price: 2.5,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
  },
  {
    id: '2',
    name: 'Cappuccino',
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
  },
  {
    id: '3',
    name: 'Iced Latte',
    price: 4.0,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60',
    category: 'Cold Drink',
  },
  {
    id: '4',
    name: 'Croissant',
    price: 2.25,
    image: 'https://plus.unsplash.com/premium_photo-1661743823829-326b78143b30?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3JvaXNhbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
    category: 'Pastry',
  },
];

export default function CoffeeShopScreen() {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (item: Product) => {
    setCart([...cart, item]);
    Alert.alert('Added to Cart', `${item.name} added!`);
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.header}>☕ Java Coffee</Text>
      <Text style={styles.subHeader}>Welcome! Choose your favorite coffee below.</Text>

      <FlatList
        data={COFFEE_MENU}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🛒 {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
        </Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 20,
  },
  subHeader: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    height: 160,
    width: '100%',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  category: {
    color: '#777',
    fontSize: 13,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#222',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 12,
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});