import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "screens/CameraScreen";
import GalleryScreen from "screens/GalleryScreen";
import {
    HomeIcon,
    CameraIcon,
    PhotoIcon,
} from "react-native-heroicons/outline";
import ImageVisualizer from "screens/ImageVisualizer";
const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            backBehavior="history"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let icon;
                    switch (route.name) {
                        case "Home":
                            icon = <HomeIcon size={size} color={color} />;
                            break;
                        case "Capture":
                            icon = <CameraIcon size={size} color={color} />;
                            break;
                        case "Gallery":
                            icon = <PhotoIcon size={size} color={color} />;
                            break;
                        case "Visualizer":
                            icon = null;
                            break;
                        default:
                            break;
                    }
                    return <>{icon}</>;
                },
                tabBarActiveTintColor: "dodgerblue",
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Capture"
                component={CameraScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Visualizer"
                component={ImageVisualizer}
                options={{
                    headerShown: false,
                    // tabBarButton: () => null,
                    tabBarStyle: {
                        display: "none",
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export default TabsNavigator;
