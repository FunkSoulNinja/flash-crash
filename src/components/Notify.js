import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    findNodeHandle
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';

function focusTextInput(node) {
    try {
        TextInputState.focusTextInput(findNodeHandle(node));
    } catch (e) {
        console.log("Couldn't focus text input: ", e.message);
    }
}

const PRIMARY_COLOR = '255, 123, 115';

class Notify extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animate: new Animated.Value(0),
            success: false
        };
    }
    handlePress = () => {
        Animated.timing(this.state.animate, {
            toValue: 1,
            duration: 300
        }).start(() => focusTextInput(this.inputRef));
    };
    handleSend = () => {
        this.setState({ success: true }, () => {
            Animated.sequence([
                Animated.timing(this.state.animate, {
                    toValue: 0,
                    duration: 300
                }),
                Animated.delay(1500)
            ]).start(() => this.setState({ success: false }));
        });
    };
    onBlur = () => {
        Animated.timing(this.state.animate, {
            toValue: 0,
            duration: 300
        }).start();
    };
    render() {
        const { success } = this.state;

        const widthInterpolate = this.state.animate.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [150, 150, 300],
            extrapolate: 'clamp'
        });
        const buttonWrapStyle = {
            width: widthInterpolate
        };

        const inputScaleInterpolate = this.state.animate.interpolate({
            inputRange: [0, 0.5, 0.6],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });

        const inputScaleStyle = {
            transform: [{ scale: inputScaleInterpolate }]
        };

        const sendButtonInterpolate = this.state.animate.interpolate({
            inputRange: [0, 0.6, 1],
            outputRange: [0, 0, 1]
        });
        const sendButtonStyle = {
            transform: [{ scale: sendButtonInterpolate }]
        };

        const notifyTextScaleInterpolate = this.state.animate.interpolate({
            inputRange: [0, 0.5],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
        const notifyTextStyle = {
            transform: [{ scale: notifyTextScaleInterpolate }]
        };
        const thankyouScaleInterpolate = this.state.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
        });
        const thankyouTextStyle = {
            transform: [{ scale: thankyouScaleInterpolate }]
        };
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this.handlePress}>
                    <Animated.View style={[styles.buttonWrap, buttonWrapStyle]}>
                        {!success &&
                            <Animated.View
                                style={[
                                    StyleSheet.absoluteFill,
                                    styles.inputWrap,
                                    inputScaleStyle
                                ]}
                            >
                                <TextInput
                                    keyboardType="email-address"
                                    placeholder="Email"
                                    placeholderTextColor={`rgba(${PRIMARY_COLOR}, 0.8)`}
                                    style={styles.textInput}
                                    onSubmitEditing={this.handleSend}
                                    onBlur={this.onBlur}
                                    ref={ref => (this.inputRef = ref)}
                                />
                                <TouchableOpacity
                                    style={[styles.sendButton, sendButtonStyle]}
                                    onPress={this.handleSend}
                                >
                                    <Text style={styles.sendText}>Send</Text>
                                </TouchableOpacity>
                            </Animated.View>}
                        {!success &&
                            <Animated.View style={notifyTextStyle}>
                                <Text style={styles.notifyText}>Notify Me</Text>
                            </Animated.View>}
                        {success &&
                            <Animated.View style={thankyouTextStyle}>
                                <Text style={styles.notifyText}>Thank You</Text>
                            </Animated.View>}
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `rgb(${PRIMARY_COLOR})`
    },
    buttonWrap: {
        backgroundColor: '#FFF',
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notifyText: {
        color: `rgb(${PRIMARY_COLOR})`,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    textInput: {
        flex: 4
    },
    sendButton: {
        backgroundColor: `rgb(${PRIMARY_COLOR})`,
        flex: 1,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendText: {
        color: '#FFF'
    }
});
export default Notify;
