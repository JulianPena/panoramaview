import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
    ViroARScene,
    ViroARSceneNavigator,
    ViroSphere,
    Viro3DObject,
    ViroText,
    ViroScene,
    ViroNode,
    ViroARPlane,
    ViroBox,
    ViroMaterials,
    ViroButton,
} from "@reactvision/react-viro";
import { Camera, useCameraDevice } from "react-native-vision-camera";

const positions = [
    [-5, 0, 0], //Izquierda
    [-5, 0, -5], //Esquina izquierda Frente
    [0, 0, -5], //Frente
    [5, 0, -5], //Esquina derecha Frente
    [5, 0, 0], //Derecha
    [5, 0, 5], //Esquina derecha Atras
    [0, 0, 5], //atras
    [-5, 0, 5], //Esquina izquierda Atras
];
interface ARSceneProps {
    onCapture?: () => void;
}
interface ARSceneRef {
    resetBoxes: () => void;
}
ViroMaterials.createMaterials({
    box: {
        lightingModel: "Constant",
        diffuseColor: "red",
    },
    boxTouched: {
        lightingModel: "Constant",
        diffuseColor: "green",
    },
    transparent: {
        lightingModel: "Constant",
        diffuseColor: "transparent",
    },
});
const ARScene = forwardRef<ARSceneRef, ARSceneProps>(
    ({ onCapture }: ARSceneProps, ref) => {
        const [capture, setCapture] = useState(
            new Array(positions.length).fill(false)
        );
        const [showElements, setShowElements] = useState(true);
        let boxPoistions = positions;

        const handleCapture = (index: number) => {
            console.log("Capturing", index);

            if (!capture[index]) {
                setCapture((prev) => {
                    const newCapture = [...prev];
                    newCapture[index] = true;
                    return newCapture;
                });
            }
            setTimeout(() => {
                onCapture && onCapture();
            }, 100);
        };

        const resetBoxes = () => {
            setCapture(new Array(positions.length).fill(false));
        };

        useImperativeHandle(
            ref,
            () => ({
                resetBoxes,
            }),
            []
        );

        return (
            <ViroARScene>
                <View>
                    {boxPoistions.map((pos, index) => {
                        const textOffset = -0.5; // Distancia del texto respecto a la caja
                        const textPosition = [
                            pos[0] > 0
                                ? pos[0] + textOffset
                                : pos[0] - textOffset, // Ajusta según la dirección
                            pos[1] + 1, // Eleva el texto sobre la caja
                            pos[2] > 0
                                ? pos[2] + textOffset
                                : pos[2] - textOffset, // Ajusta según la dirección
                        ];
                        return (
                            <ViroNode
                                key={index}
                                position={[pos[0], pos[1], pos[2]]}
                            >
                                <ViroBox
                                    viroTag={"clickableBox" + index}
                                    scale={[1, 1, 1]}
                                    materials={
                                        capture[index]
                                            ? ["transparent"]
                                            : ["box"]
                                    }
                                    dragType="FixedToWorld"
                                    onClickState={(state) => {
                                        if (state === 1) {
                                            handleCapture(index);
                                        }
                                    }}
                                />
                                <ViroText
                                    text={index.toString()}
                                    style={{
                                        color: "white",
                                        fontSize: 24,
                                        fontWeight: "bold",
                                    }}
                                    scale={[1, 1, 1]}
                                    position={[
                                        textPosition[0],
                                        textPosition[1],
                                        textPosition[2],
                                    ]}
                                    transformBehaviors={["billboard"]}
                                />
                            </ViroNode>
                        );
                    })}

                    <ViroText
                        text="Mueve la camara hacia los cuadros rojos para tomar fotos"
                        position={[0, -1, -3]}
                        scale={[1, 1, 1]}
                        style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: "bold",
                        }}
                    />
                </View>
            </ViroARScene>
        );
    }
);

export default ARScene;
