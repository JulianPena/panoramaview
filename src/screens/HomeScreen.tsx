import React from "react";
import type { PropsWithChildren } from "react";
import {
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
    const isDarkMode = useColorScheme() === "dark";
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}
            >
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}
            >
                {children}
            </Text>
        </View>
    );
}

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === "dark";

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}
            >
                <View
                    style={{
                        backgroundColor: isDarkMode
                            ? Colors.black
                            : Colors.white,
                        flex: 1,
                        height: 290,
                    }}
                >
                    <ImageBackground
                        source={require("@assets/images/partial-react-logo.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        resizeMode="cover"
                    ></ImageBackground>
                </View>
                <View
                    style={{
                        backgroundColor: isDarkMode
                            ? Colors.black
                            : Colors.white,
                        flex: 2,
                    }}
                >
                    <Text
                        style={[
                            styles.title,
                            { color: isDarkMode ? Colors.white : Colors.black },
                        ]}
                    >
                        Welcome to 360° Capture!
                    </Text>
                    <Section title="Step 1: Capture">
                        Go to <Text style={styles.highlight}>Capture</Text>,
                        follow the red guide points, and take multiple photos to
                        cover all angles.
                    </Section>
                    <Section title="Step 2: Processing">
                        Your images are automatically merged into a 360°
                        panorama.
                    </Section>
                    <Section title="Step 3: Save & View">
                        Name and save your panorama. Find it in the{" "}
                        <Text style={styles.highlight}>Gallery</Text>.
                    </Section>
                    <Section title="Step 4: Explore">
                        Open panoramas in fullscreen, rename, or delete them as
                        needed.
                    </Section>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "400",
    },
    highlight: {
        fontWeight: "700",
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        paddingTop: 25,
        paddingHorizontal: 25,
    },
});

export default App;
