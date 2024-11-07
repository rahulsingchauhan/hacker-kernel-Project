import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const storedProducts = await AsyncStorage.getItem("products");
      if (storedProducts) setProducts(JSON.parse(storedProducts));
    });

    return unsubscribe;
  }, [navigation]);

  const handleDeleteProduct = async (productName) => {
    const filteredProducts = products.filter((product) => product.name !== productName);
    setProducts(filteredProducts);
    await AsyncStorage.setItem("products", JSON.stringify(filteredProducts));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search Products"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        numColumns={2} // Display two cards per row
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.noProductsText}>No Products Found</Text>}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item.name)}
            >
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  search: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  noProductsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#aaa",
    fontSize: 16,
  },
  productCard: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "45%", // Adjust width for two cards per row
    marginHorizontal: "2.5%", // Adjust spacing between cards
    position: "relative", // Allow absolute positioning of delete button
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  productDetails: {
    flex: 1,
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  productCategory: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  productDescription: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
    textAlign: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 20,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    elevation: 5,
  },
  fabText: { color: "white", fontSize: 28, fontWeight: "bold" },
  logoutButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 20,
  },
  logoutText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default HomeScreen;