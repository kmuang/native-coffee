import { ThemedView } from '@/components/themed-view';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const COFFEE_MENU: Product[] = [
  {
    id: '1',
    name: 'Espresso',
    price: 2.5,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
    description: 'Rich and concentrated espresso shot — bold flavor with caramel notes.',
  },
  {
    id: '2',
    name: 'Cappuccino',
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
    description: 'Espresso with steamed milk and thick milk foam — creamy and smooth.',
  },
  {
    id: '3',
    name: 'Iced Latte',
    price: 4.0,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=800&q=60',
    category: 'Cold Drink',
    description: 'Chilled espresso with milk and ice — refreshing and smooth.',
  },
  {
    id: '4',
    name: 'Mocha',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
    description: 'Espresso with chocolate and steamed milk — rich and indulgent.',
  },
  {
    id: '5',
    name: 'Americano',
    price: 3.0,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
    description: 'Espresso with hot water — smooth and bold coffee flavor.',
  },
  {
    id: '6',
    name: 'Flat White',
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
    description: 'Espresso with velvety microfoam milk — silky and strong.',
  },
  {
    id: '7',
    name: 'Croissant',
    price: 2.25,
    image: 'https://plus.unsplash.com/premium_photo-1661743823829-326b78143b30?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3JvaXNhbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000',
    category: 'Pastry',
    description: 'Flaky and buttery French croissant — perfect with coffee.',
  },
  {
    id: '8',
    name: 'Blueberry Muffin',
    price: 2.75,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZWJlcnJ5JTIwbXVmZmlufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1400',
    category: 'Pastry',
    description: 'Soft muffin loaded with fresh blueberries — sweet and moist.',
  },
  {
    id: '9',
    name: 'Caramel Macchiato',
    price: 4.5,
    image: 'https://plus.unsplash.com/premium_photo-1723759448747-1d174225e61f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmFuaWxsYSUyMGxhdHRlfGVufDB8fDB8fHww',
    category: 'Hot Drink',
    description: 'Espresso with vanilla syrup, steamed milk, and caramel drizzle — sweet and creamy.',
  },
  {
    id: '10',
    name: 'Cold Brew',
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=800&q=60',
    category: 'Cold Drink',
    description: 'Smooth cold-steeped coffee — less acidic with naturally sweet notes.',
  },
  {
    id: '11',
    name: 'Cortado',
    price: 3.25,
    image: 'https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
    description: 'Equal parts espresso and steamed milk — perfectly balanced and smooth.',
  },
  {
    id: '12',
    name: 'Vanilla Latte',
    price: 4.0,
    image: 'https://images.unsplash.com/photo-1683122925249-8b15d807db4b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFuaWxsYSUyMGxhdHRlfGVufDB8fDB8fHww',
    category: 'Hot Drink',
    description: 'Espresso with vanilla syrup and steamed milk — sweet and comforting.',
  },
];

export default function CoffeeShopScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Hot Drink', 'Cold Drink', 'Pastry'];

  const filteredMenu = useMemo(() => {
    return COFFEE_MENU.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (item: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    Alert.alert('Added to Cart', `${item.name} added!`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prevCart => {
      const updated = prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      );
      return updated.filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setCart([]) },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>☕ Java Coffee</Text>
      </View>
      <Text style={styles.subHeader}>Discover your perfect brew</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search coffee, pastries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Coffee Menu List */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubText}>Try a different search or category</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isFavorite = favorites.includes(item.id);
          return (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => setSelectedProduct(item)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
              >
                <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
              <View style={styles.overlay}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.category}</Text>
                </View>
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <TouchableOpacity 
          style={styles.cartContainer}
          onPress={() => setShowCart(true)}
        >
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItems}</Text>
          </View>
          <Text style={styles.cartText}>🛒 View Cart - ${totalPrice.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCart(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Your Cart</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.cartScroll}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.removeButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.cartFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total ({totalItems} items)</Text>
                <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
              {cart.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearCartButton}
                  onPress={clearCart}
                >
                  <Text style={styles.clearCartButtonText}>Clear Cart</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Product Description Modal */}
      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedProduct && (
                <>
                  <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <View style={styles.modalBadge}>
                        <Text style={styles.modalBadgeText}>{selectedProduct.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.modalName}>{selectedProduct.name}</Text>
                    <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                    <Text style={styles.modalPrice}>${selectedProduct.price.toFixed(2)}</Text>
                    
                    <TouchableOpacity
                      style={styles.modalAddButton}
                      onPress={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                    >
                      <Text style={styles.modalAddButtonText}>Add to Cart</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={() => setSelectedProduct(null)}
                    >
                      <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>@Noel Muang</Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 60, 
    backgroundColor: '#f8f9fa',
  },
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  logoIcon: { 
    width: 36, 
    height: 36, 
    marginRight: 10,
  },
  header: { 
    fontSize: 32, 
    fontWeight: '900',
    color: '#2d3436',
  },
  subHeader: { 
    textAlign: 'center', 
    color: '#636e72', 
    marginBottom: 16,
    fontSize: 15,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2d3436',
  },
  clearIcon: {
    fontSize: 20,
    color: '#999',
    paddingHorizontal: 8,
  },
  categoryScroll: {
    marginBottom: 28,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#6c5ce7',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  categoryTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  list: { 
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    flex: 1,
    marginHorizontal: 4,
    maxWidth: '48%',
  },
  image: { 
    height: 140, 
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  info: { 
    padding: 14,
  },
  name: { 
    fontSize: 16, 
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { 
    fontSize: 18, 
    fontWeight: '800',
    color: '#6c5ce7',
  },
  addButton: {
    backgroundColor: '#2d3436',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  cartContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#2d3436',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cartBadge: {
    backgroundColor: '#6c5ce7',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackground: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'flex-end',
  },
  modalContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalImage: { 
    width: '100%', 
    height: 280,
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    marginBottom: 12,
  },
  modalBadge: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  modalBadgeText: {
    color: '#495057',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modalName: { 
    fontSize: 28, 
    fontWeight: '900',
    color: '#2d3436',
    marginBottom: 12,
  },
  modalDescription: { 
    color: '#636e72', 
    lineHeight: 24,
    fontSize: 15,
    marginBottom: 20,
  },
  modalPrice: { 
    fontSize: 32, 
    fontWeight: '900',
    color: '#6c5ce7',
    marginBottom: 24,
  },
  modalAddButton: {
    backgroundColor: '#2d3436',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalAddButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: '#f1f3f5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#495057',
    fontWeight: '700',
    fontSize: 16,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2d3436',
  },
  closeButton: {
    fontSize: 28,
    color: '#999',
    fontWeight: '300',
  },
  cartScroll: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c5ce7',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
    marginRight: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    paddingHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
  },
  cartFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    backgroundColor: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#636e72',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2d3436',
  },
  checkoutButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#6c5ce7',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  clearCartButton: {
    backgroundColor: '#f1f3f5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  clearCartButtonText: {
    color: '#e74c3c',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 14,
    color: '#636e72',
    fontWeight: '500',
  },
});
