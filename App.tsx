/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import {
    DefaultTheme,
    DarkTheme,
    NavigationContainer,
} from "@react-navigation/native";
import {} from "@react-navigation/native-stack";
import { StatusBar, useColorScheme, View } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabsNavigator from "./src/navigation/TabsNavigator";

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "white",
        primary: "rgb(255, 45, 85)",
    },
};

const Stack = createNativeStackNavigator();
function App(): React.JSX.Element {
    const colorScheme = useColorScheme();

    return (
        // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1 }}>
            <NavigationContainer theme={MyTheme}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name="Root"
                        component={TabsNavigator}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar
                barStyle={
                    colorScheme === "dark" ? "light-content" : "dark-content"
                }
            />
        </View>
        // </ThemeProvider>
    );
}

export default App;
