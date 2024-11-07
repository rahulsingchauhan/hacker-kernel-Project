import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // Updated to store the image URI
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      ToastAndroid.show("Permission to access media is required!", ToastAndroid.SHORT);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Store the selected image URI
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !price.trim() || !image || !category.trim() || !description.trim()) {
      ToastAndroid.show("All fields are required", ToastAndroid.SHORT);
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      ToastAndroid.show("Enter a valid price", ToastAndroid.SHORT);
      return;
    }

    const storedProducts = await AsyncStorage.getItem("products");
    const products = storedProducts ? JSON.parse(storedProducts) : [];

    if (products.some((product) => product.name.toLowerCase() === name.toLowerCase())) {
      ToastAndroid.show("Product already exists", ToastAndroid.SHORT);
      return;
    }

    const newProduct = { name, price, image, category, description };
    const updatedProducts = [...products, newProduct];

    await AsyncStorage.setItem("products", JSON.stringify(updatedProducts));
    ToastAndroid.show("Product added successfully", ToastAndroid.SHORT);

    // Reset inputs and navigate back
    setName("");
    setPrice("");
    setImage(null);
    setCategory("");
    setDescription("");
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>Pick an Image</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Add Product" color="blue" onPress={handleAdd} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#f8f9fa" },
  form: { flexGrow: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 150,
    backgroundColor: "#f0f0f0",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    color: "#888",
  },
});

export default AddProductScreen;
