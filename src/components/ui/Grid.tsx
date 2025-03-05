import React from "react";
import { StyleSheet, View } from "react-native";

const Grid = () => {
    return (
        <View style={styles.container}>
            <View style={styles.gridContainer}>
                <View style={styles.boxOne}></View>
                <View style={styles.box}></View>
                <View style={styles.box}></View>
                <View style={styles.boxTwo}></View>
            </View>
            <View style={styles.pointContainer}>
                <View style={styles.point}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        pointerEvents: "none",
    },
    gridContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    boxOne: {
        width: "50%",
        height: "50%",
        borderRightColor: "white",
        borderRightWidth: 1,
        borderBottomColor: "white",
        borderBottomWidth: 1,
    },
    box: {
        width: "50%",
        height: "50%",
    },
    boxTwo: {
        width: "50%",
        height: "50%",
        borderLeftColor: "white",
        borderLeftWidth: 1,
        borderTopColor: "white",
        borderTopWidth: 1,
    },
    pointContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    point: {
        width: 10,
        height: 10,
        backgroundColor: "white",
        borderRadius: 10,
    },
});

export default Grid;
