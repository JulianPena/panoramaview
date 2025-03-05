import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { View } from "react-native";
import {
    ViroARScene,
    ViroText,
    ViroNode,
    ViroBox,
    ViroMaterials,
    ViroImage,
} from "@reactvision/react-viro";

const positions = [
    [3.54, 3.54, 0.0],
    [3.06, 3.54, 1.77],
    [1.77, 3.54, 3.06],
    [0.0, 3.54, 3.54],
    [-1.77, 3.54, 3.06],
    [-3.06, 3.54, 1.77],
    [-3.54, 3.54, 0.0],
    [-3.06, 3.54, -1.77],
    [-1.77, 3.54, -3.06],
    [0.0, 3.54, -3.54],
    [1.77, 3.54, -3.06],
    [3.06, 3.54, -1.77],

    [5.0, 0, 0.0],
    [4.62, 0, 1.91],
    [3.54, 0, 3.54],
    [1.91, 0, 4.62],
    [0.0, 0, 5.0],
    [-1.91, 0, 4.62],
    [-3.54, 0, 3.54],
    [-4.62, 0, 1.91],
    [-5.0, 0, 0.0],
    [-4.62, 0, -1.91],
    [-3.54, 0, -3.54],
    [-1.91, 0, -4.62],
    [0.0, 0, -5.0],
    [1.91, 0, -4.62],
    [3.54, 0, -3.54],
    [4.62, 0, -1.91],

    [-3.54, -3.54, 0.0],
    [-3.06, -3.54, -1.77],
    [-1.77, -3.54, -3.06],
    [0.0, -3.54, -3.54],
    [1.77, -3.54, -3.06],
    [3.06, -3.54, -1.77],
    [3.54, -3.54, 0.0],
    [3.06, -3.54, 1.77],
    [1.77, -3.54, 3.06],
    [0.0, -3.54, 3.54],
    [-1.77, -3.54, 3.06],
    [-3.06, -3.54, 1.77],
];
interface ARSceneProps {
    onCapture?: () => void;
    imagesList: string[];
}
interface ARSceneRef {
    resetBoxes: () => void;
}
ViroMaterials.createMaterials({
    box: {
        lightingModel: "Constant",
        diffuseColor: "red",
    },
    white: {
        lightingModel: "Constant",
        diffuseColor: "DodgerBlue",
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
    ({ onCapture, imagesList }: ARSceneProps, ref) => {
        const [capture, setCapture] = useState(
            new Array(positions.length).fill(false)
        );
        const lastIndex = useRef(-1);
        const [images, setImages] = useState(
            new Array(positions.length).fill("")
        );
        const [showElements, setShowElements] = useState(true);
        let boxPoistions = positions;

        const handleCapture = (index: number) => {
            console.log("Capturing", index);
            lastIndex.current = index;
            setShowElements(false);
            if (!capture[index]) {
                setCapture((prev) => {
                    const newCapture = [...prev];
                    newCapture[index] = true;
                    return newCapture;
                });
            }
            setTimeout(() => {
                onCapture && onCapture();
                setShowElements(true);
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

        useEffect(() => {
            console.log("Images update", images);
            if (imagesList.length > 0) {
                let newList = images;
                newList[lastIndex.current] = imagesList[imagesList.length - 1];
                console.log("New list", newList);
                setImages(newList);
            }
        }, [imagesList]);

        return (
            <ViroARScene>
                <View>
                    {boxPoistions.map((pos, index) => {
                        const textOffset = -0.5; // Distancia del texto respecto a la caja
                        const textPosition = [
                            pos[0] > 0
                                ? pos[0] + textOffset
                                : pos[0] - textOffset, // Ajusta según la dirección
                            pos[1], // Eleva el texto sobre la caja
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
                                    scale={[0.2, 0.2, 0.2]}
                                    materials={
                                        capture[index]
                                            ? ["transparent"]
                                            : showElements
                                            ? ["white"]
                                            : ["transparent"]
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
                                        color: capture[index]
                                            ? "transparent"
                                            : showElements
                                            ? "white"
                                            : "transparent",
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
                                {/* <ViroImage
                                    height={2}
                                    width={1}
                                    source={
                                        images[index] != ""
                                            ? { uri: images[index] }
                                            : require("assets/images/referen.png")
                                    }
                                    transformBehaviors={["billboard"]}
                                    position={[pos[0], pos[1], pos[2]]}
                                    scale={[1, 1, 1]}
                                    materials={
                                        images[index] === ""
                                            ? ["transparent"]
                                            : ["boxTouched"]
                                    }
                                /> */}
                            </ViroNode>
                        );
                    })}
                </View>
            </ViroARScene>
        );
    }
);

export default ARScene;
