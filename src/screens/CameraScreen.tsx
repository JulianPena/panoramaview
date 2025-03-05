import CameraGuide from "components/ui/camera/CameraGuide";
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    Dimensions,
    Image,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ViroARScene,
    ViroARSceneNavigator,
    ViroScene,
} from "@reactvision/react-viro";
import ARScene from "components/ui/camera/ARScene";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Grid from "components/ui/Grid";

const ARSceneContext = createContext<{ resetBoxes?: () => void }>({});

export const useARScene = () => useContext(ARSceneContext);

const CameraScreen = () => {
    const photos = useRef<string[]>([]);
    const [photosCollection, setPhotosCollection] = useState<string[]>([]);
    const [modalInstructionsVisible, setModalInstructionsVisible] =
        useState(true);
    const arSceneRef = useRef<ViroARSceneNavigator>(null);

    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(
        "Uploading images to server..."
    );
    const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
        null
    );
    const [nameModalVisible, setNameModalVisible] = useState(false);
    const [photoName, setPhotoName] = useState("");

    const handleCapture = () => {
        console.log("Handle capture");
        takePhoto();
    };

    const takePhoto = () => {
        console.log("Capturing screenshot", arSceneRef.current);
        if (arSceneRef.current) {
            arSceneRef.current.arSceneNavigator
                .takeScreenshot(
                    "screenshot" + Math.round(Math.random() * 1000),
                    false
                )
                .then((image: any) => {
                    console.log("Images List", photos);
                    const newArray = [...photos.current, image.url];
                    console.log("New array", newArray);
                    photos.current = newArray;
                    setIsTakingPhoto(false);
                    setPhotosCollection(newArray);

                    if (photos.current.length === 40) {
                        sendPhotosToBackend(photos.current);
                    }
                });
        }
    };

    useEffect(() => {
        console.log("Photos", photos);
    }, [photos]);

    const sendPhotosToBackend = (_photos: string[]) => {
        setLoading(true);
        setLoadingMessage("Processing your images...");

        const formData = new FormData();
        _photos.forEach((photo, index) => {
            formData.append("images", {
                uri: photo,
                name: `photo${index}.jpg`,
                type: "image/jpeg",
            } as any);
        });

        console.log("🚀 Sending request to backend...");
        fetch("https://urchin-app-9w2fs.ondigitalocean.app/stitch", {
            body: formData,
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((response: any) => {
                console.log("✅ Server Response:", response);

                if (response.status === 200 && response.data.url) {
                    setProcessedImageUrl(response.data.url);
                    setLoading(false);
                    setNameModalVisible(true);
                } else {
                    Alert.alert(
                        "Error",
                        "The server did not return a valid image URL."
                    );
                    setLoading(false);
                }
            })
            .catch((error: any) => {
                console.error("❌ Error sending request to backend:", error);
                Alert.alert(
                    "Error",
                    "Something went wrong while sending the image."
                );
                arSceneRef.current?.arSceneNavigator.resetARSession(
                    false,
                    false
                );
                setPhotosCollection([]);
                photos.current = [];
                setProcessedImageUrl(null);
                setLoading(false);
            });
    };
    const downloadImage = async (imageUrl: string): Promise<string> => {
        fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const fileName = `image_${Date.now()}.jpg`;
                const reader = new FileReader();
                let uri = "";

                reader.onloadend = async () => {
                    const base64data = reader.result.toString();
                    uri = base64data;
                    await AsyncStorage.setItem("galleryImages", base64data);
                    console.log("✅ Image saved locally at:", uri);
                };

                reader.readAsDataURL(blob);
                return uri;
            })
            .catch((error) => {
                console.error("Error downloading image:", error);
                return null;
            });

        return "null";
    };
    const saveImage = async () => {
        if (processedImageUrl && photoName.trim()) {
            const localUri = await downloadImage(processedImageUrl);

            if (!localUri) {
                Alert.alert("Error", "Failed to save the image locally.");
                return;
            }

            const newImage = { name: photoName, uri: localUri };
            const storedImages = await AsyncStorage.getItem("galleryImages");
            const images = storedImages ? JSON.parse(storedImages) : [];
            images.push(newImage);
            await AsyncStorage.setItem("galleryImages", JSON.stringify(images));

            setPhotosCollection([]);
            photos.current = [];
            setProcessedImageUrl(null);
            setPhotoName("");
            setNameModalVisible(false);

            // router.push("/gallery");
        }
    };

    return (
        <>
            <View style={[styles.container]}>
                <ViroARSceneNavigator
                    ref={arSceneRef}
                    initialScene={{
                        scene: () => (
                            <ARScene
                                onCapture={handleCapture}
                                imagesList={photos.current}
                            />
                        ),
                    }}
                />
                <Grid />
                {loading && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={styles.loadingText}>
                            {loadingMessage}{" "}
                        </Text>
                        <ActivityIndicator size="small" color="#007AFF" />
                    </View>
                )}
                <View>
                    <ScrollView horizontal={true}>
                        {photos.current.map((photo, index) => (
                            <View key={index}>
                                <Image
                                    source={{ uri: photo }}
                                    style={{ width: 100, height: 100 }}
                                />
                                <View
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        left: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 40,
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {index}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View>{isTakingPhoto ? <Text>Capturing</Text> : null}</View>
                </View>
                <Modal
                    visible={modalInstructionsVisible}
                    transparent
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                Toca los puntos blancos para capturar una
                                imagen, intenta centrarlos en la grilla antes de
                                capturar la foto
                            </Text>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={() => {
                                    setModalInstructionsVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>
                                    Entendido!
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={nameModalVisible}
                    transparent
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                Save 360° Image
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter image name"
                                value={photoName}
                                onChangeText={setPhotoName}
                            />
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={saveImage}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 0,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
        fontSize: 16,
    },

    saveButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default CameraScreen;
