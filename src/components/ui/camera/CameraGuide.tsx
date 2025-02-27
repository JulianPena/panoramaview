import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { accelerometer, gyroscope } from "react-native-sensors";
import Svg, { Circle } from "react-native-svg";

interface CameraGuideProps {
    onCapture: () => void;
}

const positions = [0, 60, 120, 180, 240, 300]; // 6 fotos 360
const CameraGuide = ({ onCapture }: CameraGuideProps) => {
    const [angle, setAngle] = useState(0);
    const [photoCount, setPhotoCount] = useState(0);
    const [index, setIndex] = useState(0);

    const totalPhotos = 6;

    useEffect(() => {
        const subscription = accelerometer.subscribe(({ x, y, z }) => {
            const angle = Math.round((Math.atan2(x, z) * 180) / Math.PI);
            setAngle(angle);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleCapture = () => {
        if (index < positions.length - 1) {
            setIndex(index + 1);
        }
        setPhotoCount(photoCount + 1);
        onCapture();
    };

    const progress = (photoCount / totalPhotos) * 360;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
            }}
        >
            <Svg height="100" width="100" viewBox="0 0 100 100">
                <Circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#eee"
                    strokeWidth="10"
                    fill="white"
                />
                <Circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="blue"
                    strokeWidth="5"
                    fill="white"
                    strokeDasharray={`${progress}, 360`}
                />
            </Svg>
            <Text style={{ fontSize: 20 }}>
                Fotos tomadas: {photoCount}/{totalPhotos}
            </Text>
            <Text style={{ fontSize: 20, color: "red" }}>
                Posición: {positions[index]} | Angulo{angle}°
            </Text>
            <Button title="Tomar Foto" onPress={handleCapture} />
        </View>
    );
};

export default CameraGuide;
