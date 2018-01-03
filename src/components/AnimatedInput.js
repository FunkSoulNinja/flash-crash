import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity
    // findNodeHandle
} from 'react-native';

// import TextInputState from 'react-native/lib/TextInputState';

// function focusTextInput(ref) {
//     try {
//         TextInputState.focusTextInput(findNodeHandle(ref));
//     } catch (e) {
//         console.log("Couldn't focus text input: ", e.message);
//     }
// }

const PRIMARY_COLOR = '64, 64, 64';

class AnimatedInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animate: new Animated.Value(0),
            success: false,
            open: false
        };
    }
    handlePress = () => {
        Animated.timing(this.state.animate, {
            toValue: 1,
            duration: 250
            // }).start(() => focusTextInput(findNodeHandle(this.inputRef)));
        }).start(() => {
            this.setState(state => ({ ...state, open: true }));
            this.inputRef.focus();
        });
    };
    complete = () => {
        this.setState({ success: true }, () => {
            Animated.sequence([
                Animated.timing(this.state.animate, {
                    toValue: 0,
                    duration: 300
                }),
                Animated.delay(500)
            ]).start(() => this.setState(state => ({ ...state, success: false, open: false })));
            this.props.onComplete && this.props.onComplete();
        });
    };
    onBlur = () => {
        this.setState(state => ({ ...state, open: false }));
        Animated.timing(this.state.animate, {
            toValue: 0,
            duration: 300
        }).start();
    };
    componentWillUnmount() {
        this.inputRef = null;
    }
    render() {
        const { success } = this.state;

        const reverseInterpolate = this.state.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
        const widthInterpolate = this.state.animate.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['50%', '90%', '100%'],
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

        const inputButtonInterpolate = this.state.animate.interpolate({
            inputRange: [0, 0.6, 1],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });
        const inputButtonStyle = {
            transform: [{ scale: inputButtonInterpolate }]
        };
        const buttonTextStyle = {
            flexDirection: 'row',
            opacity: reverseInterpolate
        };
        const finishMessageStyle = {
            transform: [{ scale: reverseInterpolate }]
        };
        return (
            <View style={styles.container}>
                {this.props.left}
                <TouchableWithoutFeedback onPress={this.handlePress}>
                    <Animated.View style={[styles.buttonWrap, buttonWrapStyle]}>
                        {!success && (
                            <Animated.View
                                style={[StyleSheet.absoluteFill, styles.inputWrap, inputScaleStyle]}
                            >
                                {this.state.open && (
                                    <TextInput
                                        selectTextOnFocus
                                        onChangeText={this.props.onChangeText}
                                        placeholder={this.props.placeholder || this.props.titleText}
                                        placeholderTextColor={`rgba(${PRIMARY_COLOR}, 0.8)`}
                                        style={styles.textInput}
                                        onSubmitEditing={this.complete}
                                        onBlur={this.onBlur}
                                        ref={ref => (this.inputRef = ref)}
                                        underlineColorAndroid="transparent"
                                    />
                                )}
                                {this.state.open &&
                                    !!this.props.finishButton && (
                                        <TouchableOpacity onPress={this.complete}>
                                            <Animated.View
                                                style={[styles.inputButton, inputButtonStyle]}
                                            >
                                                <Text style={styles.sendText}>
                                                    {this.props.finishButton}
                                                </Text>
                                            </Animated.View>
                                        </TouchableOpacity>
                                    )}
                            </Animated.View>
                        )}
                        {!success && (
                            <Animated.View style={buttonTextStyle}>
                                {!!this.props.icon && this.props.icon()}
                                <Text style={styles.notifyText}>{this.props.titleText}</Text>
                            </Animated.View>
                        )}
                        {success && (
                            <Animated.View style={finishMessageStyle}>
                                <Text style={styles.notifyText}>{this.props.finishText}</Text>
                            </Animated.View>
                        )}
                    </Animated.View>
                </TouchableWithoutFeedback>
                {this.props.right}
            </View>
        );
    }
}
AnimatedInput.defaultProps = {
    titleText: 'titleText',
    finishText: ''
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        padding: 5,
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
        paddingVertical: 10,
        paddingHorizontal: 10
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
    inputButton: {
        backgroundColor: `rgb(${PRIMARY_COLOR})`,
        flex: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendText: {
        color: '#FFF'
    }
});
export default AnimatedInput;
