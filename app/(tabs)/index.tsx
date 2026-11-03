import { ThemedView } from '@/components/themed-view';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Head from 'expo-router/head';
import { useLocalSearchParams } from 'expo-router';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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

interface CompletedOrder {
  id: string;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  items: { name: string; quantity: number }[];
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
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=60',
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
  {
    id: '13',
    name: 'Matcha Latte',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=60',
    category: 'Cold Drink',
    description: 'Earthy matcha blended with creamy milk for a smooth, refreshing sip.',
  },
  {
    id: '14',
    name: 'Chai Latte',
    price: 4.0,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=60',
    category: 'Hot Drink',
    description: 'Black tea steeped with warming spices and finished with steamed milk.',
  },
  {
    id: '15',
    name: 'Affogato',
    price: 4.5,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=60',
    category: 'Cold Drink',
    description: 'A scoop of vanilla gelato finished with a shot of hot espresso.',
  },
  {
    id: '16',
    name: 'Banana Bread',
    price: 3.0,
    image: 'https://images.unsplash.com/photo-1569762404472-026308ba6b64?auto=format&fit=crop&w=800&q=60',
    category: 'Pastry',
    description: 'Moist banana bread baked with ripe bananas and a hint of cinnamon.',
  },
  {
    id: '17',
    name: 'Caramel Frappe',
    price: 4.75,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=60',
    category: 'Cold Drink',
    description: 'Blended iced coffee with creamy milk and a swirl of caramel.',
  },
  {
    id: '18',
    name: 'Iced Matcha',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1749280447307-31a68eb38673?auto=format&fit=crop&w=800&q=60',
    category: 'Cold Drink',
    description: 'Bright matcha whisked smooth and poured over chilled milk and ice.',
  },
];

export default function CoffeeShopScreen() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return [];
    try {
      const savedCart = window.localStorage.getItem('java-coffee-cart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart as CartItem[] : [];
    } catch {
      return [];
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const checkoutParams = useLocalSearchParams<{ checkout?: string; session_id?: string }>();

  const categories = ['All', 'Hot Drink', 'Cold Drink', 'Pastry'];

  const filteredMenu = useMemo(() => {
    return COFFEE_MENU.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesCategory;
    });
  }, [selectedCategory]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem('java-coffee-cart', JSON.stringify(cart));
    }
  }, [cart]);

  const verifyCheckoutSession = useCallback(async (sessionId: string) => {
    const checkoutApiUrl = process.env.EXPO_PUBLIC_CHECKOUT_API_URL?.replace(/\/$/, '');
    if (!checkoutApiUrl) {
      setCheckoutNotice('We couldn’t verify your payment. Please contact the café before trying again.');
      return;
    }

    setCheckoutPending(true);
    setCheckoutNotice(null);
    try {
      const response = await fetch(`${checkoutApiUrl}/checkout-session?session_id=${encodeURIComponent(sessionId)}`);
      const order = await response.json() as CompletedOrder & { error?: string };
      if (!response.ok) throw new Error(order.error || 'Payment verification failed.');
      if (order.paymentStatus !== 'paid') {
        setCheckoutNotice('Payment is still processing. Your cart has been kept.');
        return;
      }
      setCompletedOrder(order);
      setCart([]);
      setShowCart(false);
    } catch {
      setCheckoutNotice('We couldn’t verify your payment yet. Your cart has been kept.');
    } finally {
      setCheckoutPending(false);
    }
  }, []);

  useEffect(() => {
    if (checkoutParams.checkout === 'success' && checkoutParams.session_id) {
      void verifyCheckoutSession(checkoutParams.session_id);
    } else if (checkoutParams.checkout === 'cancel') {
      setCheckoutNotice('Checkout was canceled. Your cart is still here.');
    }
  }, [checkoutParams.checkout, checkoutParams.session_id, verifyCheckoutSession]);

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

  const startCheckout = async () => {
    const checkoutApiUrl = process.env.EXPO_PUBLIC_CHECKOUT_API_URL?.replace(/\/$/, '');
    if (!checkoutApiUrl) {
      Alert.alert('Checkout unavailable', 'Set EXPO_PUBLIC_CHECKOUT_API_URL to your Stripe checkout server.');
      return;
    }

    setCheckoutPending(true);
    try {
      const response = await fetch(`${checkoutApiUrl}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(({ id, quantity }) => ({ id, quantity })) }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.url !== 'string' || !result.url.startsWith('https://checkout.stripe.com/')) {
        throw new Error(result.error || 'Could not start Stripe Checkout.');
      }

      setShowCart(false);
      if (Platform.OS === 'web') {
        window.location.assign(result.url);
      } else {
        await Linking.openURL(result.url);
      }
    } catch (error) {
      Alert.alert('Checkout failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setCheckoutPending(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Head><title>Java Coffee</title></Head>
      <View style={styles.headerContainer}>
        <View style={styles.brandCopy}>
          <Text style={styles.header}>Java Coffee</Text>
        </View>
        <TouchableOpacity style={styles.headerCart} onPress={() => setShowCart(true)}>
          <Ionicons name="bag-handle-outline" size={22} color="#4b3026" />
          {totalItems > 0 && <View style={styles.headerCartBadge}><Text style={styles.headerCartBadgeText}>{totalItems}</Text></View>}
        </TouchableOpacity>
      </View>

      {checkoutNotice && (
        <View style={styles.checkoutNotice}>
          <Text style={styles.checkoutNoticeText}>{checkoutNotice}</Text>
          {checkoutParams.session_id && (
            <TouchableOpacity
              style={styles.checkoutRetryButton}
              onPress={() => void verifyCheckoutSession(checkoutParams.session_id!)}
              disabled={checkoutPending}
            >
              <Text style={styles.checkoutRetryText}>{checkoutPending ? 'Checking…' : 'Check again'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setCheckoutNotice(null)} accessibilityLabel="Dismiss checkout message">
            <Ionicons name="close" size={18} color="#806f65" />
          </TouchableOpacity>
        </View>
      )}
      {checkoutParams.checkout === 'success' && checkoutPending && !completedOrder && (
        <Text style={styles.verifyingText}>Verifying your payment…</Text>
      )}

      <View style={styles.categoryGrid}>
        {categories.map(category => {
          const active = selectedCategory === category;
          return <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)} style={[styles.categoryButton, active && styles.categoryButtonActive]}>
            <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{category === 'Hot Drink' ? 'Hot coffee' : category === 'Cold Drink' ? 'Cold coffee' : category === 'All' ? 'All menu' : category}</Text>
          </TouchableOpacity>;
        })}
      </View>
      <View style={styles.sectionHeading}>
        <View><Text style={styles.sectionTitle}>{selectedCategory === 'All' ? 'Made for your day' : selectedCategory}</Text><Text style={styles.sectionCaption}>{filteredMenu.length} freshly made favorites</Text></View>
      </View>

      {/* Coffee Menu List */}
      <FlatList
        key={selectedCategory}
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
          const quantityInCart = cart.find(cartItem => cartItem.id === item.id)?.quantity ?? 0;
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
              <Text style={styles.favoriteIcon}>{isFavorite ? '♥' : '♡'}</Text>
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
                  <View style={styles.cardCartActions}>
                    {quantityInCart > 0 && <>
                      <TouchableOpacity
                        style={styles.minusButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, -1);
                        }}
                        accessibilityLabel={`Remove one ${item.name}`}
                      >
                        <Text style={styles.minusButtonText}>−</Text>
                      </TouchableOpacity>
                      <View style={styles.quantityBadge}><Text style={styles.quantityBadgeText}>{quantityInCart}</Text></View>
                    </>}
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
              <TouchableOpacity style={[styles.checkoutButton, checkoutPending && styles.checkoutButtonDisabled]} onPress={startCheckout} disabled={checkoutPending || cart.length === 0}>
                <Text style={styles.checkoutButtonText}>{checkoutPending ? 'Connecting to Stripe…' : 'Checkout securely'}</Text>
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

      <Modal
        visible={!!completedOrder}
        transparent
        animationType="fade"
        onRequestClose={() => setCompletedOrder(null)}
      >
        <View style={styles.orderModalOverlay}>
          <View style={styles.orderModalCard}>
            <View style={styles.orderSuccessIcon}>
              <Ionicons name="checkmark" size={28} color="#fff" />
            </View>
            <Text style={styles.orderTitle}>Order confirmed</Text>
            <Text style={styles.orderSubtitle}>Payment received. We’re preparing your order.</Text>
            {completedOrder && (
              <>
                <Text style={styles.orderReference}>ORDER · {completedOrder.id.slice(-8).toUpperCase()}</Text>
                <View style={styles.orderItems}>
                  {completedOrder.items.map((item, index) => (
                    <View key={`${item.name}-${index}`} style={styles.orderItemRow}>
                      <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.orderItemQuantity}>× {item.quantity}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.orderTotalRow}>
                  <Text style={styles.orderTotalLabel}>Paid</Text>
                  <Text style={styles.orderTotalAmount}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: completedOrder.currency.toUpperCase() }).format(completedOrder.amountTotal / 100)}
                  </Text>
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.orderDoneButton}
              onPress={() => {
                setCompletedOrder(null);
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.history.replaceState({}, '', window.location.pathname);
                }
              }}
            >
              <Text style={styles.orderDoneButtonText}>Done</Text>
            </TouchableOpacity>
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

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 54, backgroundColor: '#f7f4ef' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, paddingHorizontal: 22 },
  brandCopy: { flex: 1 },
  headerCart: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  headerCartBadge: { position: 'absolute', right: -3, top: -3, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: '#c0774a', alignItems: 'center', justifyContent: 'center' },
  headerCartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  logoIcon: { 
    width: 36, 
    height: 36, 
    marginRight: 10,
  },
  header: { 
    fontSize: 24, 
    fontWeight: '800',
    color: '#34231d',
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 10, rowGap: 8, marginHorizontal: 20, marginBottom: 10 },
  categoryButton: { width: '48%', maxWidth: 160, height: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#fff', borderRadius: 13, borderWidth: 1, borderColor: '#eee8e1' },
  categoryButtonActive: {
    backgroundColor: '#4b3026',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#806b60',
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 7, paddingBottom: 10 },
  sectionTitle: { fontSize: 20, lineHeight: 25, color: '#34231d', fontWeight: '800', letterSpacing: -0.4 },
  sectionCaption: { color: '#99877c', fontSize: 11, marginTop: 2 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34231d',
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
    paddingHorizontal: 16, paddingBottom: 110,
  },
  row: {
    columnGap: 12,
    marginBottom: 13,
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 19, 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOpacity: 0.045, 
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    flex: 1,
    maxWidth: '48%',
    borderWidth: 1, borderColor: '#eee8e1',
  },
  image: { 
    height: 132, 
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  badge: {
    backgroundColor: 'rgba(52, 35, 29, 0.83)',
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
    padding: 12,
  },
  name: { 
    fontSize: 15, fontWeight: '700', color: '#34231d',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCartActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  minusButton: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3eee8' },
  minusButtonText: { color: '#4b3026', fontSize: 21, lineHeight: 24, fontWeight: '700' },
  quantityBadge: { minWidth: 30, height: 26, paddingHorizontal: 7, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3eee8' },
  quantityBadgeText: { color: '#4b3026', fontSize: 12, fontWeight: '800' },
  price: { 
    fontSize: 16, fontWeight: '800', color: '#a75f38',
  },
  addButton: {
    backgroundColor: '#4b3026', width: 32, height: 32, borderRadius: 12,
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
    backgroundColor: '#34231d',
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
    backgroundColor: '#a75f38',
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
    backgroundColor: '#f3eee8',
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
    color: '#34231d',
    marginBottom: 12,
  },
  modalDescription: { 
    color: '#806f65', 
    lineHeight: 24,
    fontSize: 15,
    marginBottom: 20,
  },
  modalPrice: { 
    fontSize: 32, 
    fontWeight: '900',
    color: '#a75f38',
    marginBottom: 24,
  },
  modalAddButton: {
    backgroundColor: '#34231d',
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
    backgroundColor: '#f3eee8',
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
    borderBottomColor: '#f3eee8',
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#34231d',
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
    color: '#34231d',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a75f38',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f4ef',
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
    color: '#34231d',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34231d',
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
    borderTopColor: '#f3eee8',
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
    color: '#806f65',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#34231d',
  },
  checkoutButton: {
    backgroundColor: '#a75f38',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#a75f38',
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
  checkoutButtonDisabled: { opacity: 0.65 },
  checkoutNotice: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12, backgroundColor: '#f3eee8' },
  checkoutNoticeText: { flex: 1, marginRight: 10, color: '#6f5548', fontSize: 12, lineHeight: 17 },
  checkoutRetryButton: { paddingHorizontal: 8, paddingVertical: 5 },
  checkoutRetryText: { color: '#a75f38', fontSize: 12, fontWeight: '800' },
  verifyingText: { marginHorizontal: 22, marginBottom: 10, color: '#806f65', fontSize: 12 },
  orderModalOverlay: { flex: 1, justifyContent: 'center', padding: 22, backgroundColor: 'rgba(35, 25, 21, 0.55)' },
  orderModalCard: { width: '100%', maxWidth: 420, maxHeight: '85%', alignSelf: 'center', padding: 24, borderRadius: 24, backgroundColor: '#fff' },
  orderSuccessIcon: { width: 54, height: 54, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 27, backgroundColor: '#4b3026', marginBottom: 14 },
  orderTitle: { color: '#34231d', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  orderSubtitle: { marginTop: 7, marginBottom: 22, color: '#806f65', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  orderReference: { marginBottom: 10, color: '#a75f38', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  orderItems: { maxHeight: 220, borderTopWidth: 1, borderTopColor: '#eee8e1', borderBottomWidth: 1, borderBottomColor: '#eee8e1', paddingVertical: 6 },
  orderItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9 },
  orderItemName: { flex: 1, marginRight: 12, color: '#34231d', fontSize: 14, fontWeight: '600' },
  orderItemQuantity: { color: '#806f65', fontSize: 13, fontWeight: '600' },
  orderTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 18 },
  orderTotalLabel: { color: '#806f65', fontSize: 14, fontWeight: '600' },
  orderTotalAmount: { color: '#34231d', fontSize: 21, fontWeight: '800' },
  orderDoneButton: { alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 14, backgroundColor: '#4b3026' },
  orderDoneButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  clearCartButton: {
    backgroundColor: '#f3eee8',
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
    color: '#806f65',
    fontWeight: '500',
  },
});
