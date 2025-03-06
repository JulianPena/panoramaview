import { useNavigation } from "@react-navigation/native";
import {
    Viro360Image,
    ViroARScene,
    ViroARSceneNavigator,
} from "@reactvision/react-viro";
import React from "react";
import { Button, View } from "react-native";
import { ArrowLeftIcon, ChevronLeftIcon } from "react-native-heroicons/outline";

//@ts-ignore
const ImageVisualizer = ({ route }) => {
    const navigator = useNavigation();
    console.log("Route", route.params);
    const ARVisualizer = () => {
        if (route.params.image) {
            return (
                <ViroARScene>
                    <Viro360Image source={{ uri: route.params.image }} />
                </ViroARScene>
            );
        } else {
            return (
                <ViroARScene>
                    <Viro360Image
                        source={require("assets/images/referen.png")}
                    />
                </ViroARScene>
            );
        }
    };
    const bacckHandler = () => {
        navigator.goBack();
    };
    return (
        <View style={{ flex: 1 }}>
            <ViroARSceneNavigator
                initialScene={{
                    scene: () => <ARVisualizer />,
                }}
            />
            <View
                style={{ position: "absolute", bottom: 20, left: 20, right: 0 }}
            >
                <View
                    style={{
                        backgroundColor: "white",
                        padding: 10,
                        width: 90,
                        borderRadius: 6,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <ChevronLeftIcon size={18} color="dodgerblue" />
                    <Button title="Back" onPress={bacckHandler} />
                </View>
            </View>
        </View>
    );
};

export default ImageVisualizer;
