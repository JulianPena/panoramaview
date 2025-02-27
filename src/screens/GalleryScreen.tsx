import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    Modal,
    FlatList,
    Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function GalleryScreen() {
    const [images, setImages] = useState<
        { name: string; uri: string; date: string }[]
    >([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{
        name: string;
        uri: string;
        date: string;
    } | null>(null);
    const [newName, setNewName] = useState("");
    const navigator = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            loadImages();
        }, [])
    );

    const loadImages = async () => {
        const storedImages = await AsyncStorage.getItem("galleryImages");
        if (storedImages) {
            setImages(JSON.parse(storedImages));
        }
    };

    const deleteImage = async (uri: string) => {
        Alert.alert(
            "Delete Image",
            "Are you sure you want to delete this image?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updatedImages = images.filter(
                            (img) => img.uri !== uri
                        );
                        setImages(updatedImages);
                        await AsyncStorage.setItem(
                            "galleryImages",
                            JSON.stringify(updatedImages)
                        );
                    },
                },
            ]
        );
    };

    const renameImage = async () => {
        if (!selectedImage) return;
        const updatedImages = images.map((img) =>
            img.uri === selectedImage.uri ? { ...img, name: newName } : img
        );
        setImages(updatedImages);
        await AsyncStorage.setItem(
            "galleryImages",
            JSON.stringify(updatedImages)
        );
        setModalVisible(false);
    };

    const navigateToVisualizer = () => {
        console.log("Navigate to visualizer");
        navigator.navigate("Visualizer" as never);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Gallery</Text>
            <Button title="Visualizer" onPress={navigateToVisualizer} />
            {images.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No images yet. Capture some in the Capture tab!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(item) => item.uri}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.imageCard}
                            onPress={() => {
                                setSelectedImage(item);
                                setImageModalVisible(true);
                            }}
                        >
                            <View style={styles.imageDetails}>
                                <Text style={styles.imageName}>
                                    {item.name}
                                </Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => {
                                        setSelectedImage(item);
                                        setNewName(item.name);
                                        setModalVisible(true);
                                    }}
                                >
                                    {/* <MaterialCommunityIcons name="pencil" size={18} color="white" /> */}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButtonDelete}
                                    onPress={() => deleteImage(item.uri)}
                                >
                                    {/* <MaterialCommunityIcons name="trash-can" size={18} color="white" /> */}
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Modal to Rename Image */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rename Image</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new name"
                            value={newName}
                            onChangeText={setNewName}
                        />
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={renameImage}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for Full-Screen Image Preview */}
            <Modal visible={imageModalVisible} transparent animationType="fade">
                <View style={styles.fullscreenContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setImageModalVisible(false)}
                    >
                        {/* <MaterialCommunityIcons name="close" size={30} color="white" /> */}
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage.uri }}
                            style={styles.fullscreenImage}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 80, // Más padding superior
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#888",
        fontSize: 16,
    },
    imageCard: {
        flexDirection: "row",
        backgroundColor: "#F4F4F4",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center",
        elevation: 3, // Sombra en Android
        shadowColor: "#000", // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageDetails: {
        flex: 1,
    },
    imageName: {
        fontSize: 17,
        fontWeight: "600",
        color: "#333",
    },
    imageDate: {
        fontSize: 14,
        color: "#777",
    },
    buttonContainer: {
        flexDirection: "row",
    },
    actionButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    actionButtonDelete: {
        backgroundColor: "#FF3B30",
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        width: "85%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 10,
        padding: 12,
        width: "100%",
        marginVertical: 12,
    },
    saveButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    fullscreenImage: {
        width: "100%",
        height: "85%",
        resizeMode: "contain",
    },
    closeButton: {
        position: "absolute",
        top: 50,
        right: 20,
    },
});
