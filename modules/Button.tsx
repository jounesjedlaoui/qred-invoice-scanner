import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "./DocumentScanner";
import { uiElements } from "../constants/uiElements";

export default function CustomButton({text, handler, args=undefined, textStyle, buttonStyle}) {
    function eventHandler() {
        handler(args);
    }

    return (
       <TouchableOpacity
            onPress={eventHandler}
            style={[styles.button, buttonStyle]}
            >
            <Text style={[textStyle, uiElements.centerText]}>{text}</Text>
        </TouchableOpacity>
    );
}
