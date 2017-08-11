import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Animated, findNodeHandle } from 'react-native';
import TextInputState from 'react-native/lib/TextInputState'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function focusTextInput(node) {
	try {
		TextInputState.focusTextInput(findNodeHandle(node))
	} catch(e) {
		console.log("Couldn't focus text input: ", e.message)
	}
}

const tension = 20;
const friction = 2

class Input extends Component {
	constructor(props) {
		super(props);

		this.animate = new Animated.Value(0);
	}
	onFocus = () => {
		Animated.spring(this.animate, {
			toValue: 100,
			friction,
			tension
		}).start();
	}
	onBlur = () => {
		Animated.spring(this.animate, {
			toValue: 0,
			friction,
			tension
		}).start();
	}
	render() {
		const opacity = this.animate.interpolate({
			inputRange: [0, 100],
			outputRange: [.5, 1],
			extrapolate: 'clamp'
		})
		// const left = this.animate.interpolate({
		// 	inputRange: [0, 100],
		// 	outputRange: [0, -40]
		// })
		const top = this.animate.interpolate({
			inputRange: [0, 100],
			outputRange:[0, -40]
		})

		const labelStyle = {
			opacity,
			// left,
			top
		}
		return (
			<View style={styles.container}>
				<AnimatedTextInput ref={ref => this.inputRef = ref} style={[styles.text, styles.input]} onBlur={this.onBlur} onFocus={this.onFocus}/>
				<Animated.Text style={[styles.text, styles.label, labelStyle]}>{this.props.placeholder}</Animated.Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 100,
		backgroundColor: 'rgb(40, 247, 198)',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	input: {
		backgroundColor: 'white',
		position: 'absolute',
		width: '100%'
	},
	text: {
		fontSize: 30,
		height: 30,
		// marginHorizontal: 10,
	},
	label: {
		// position: 'absolute',
		backgroundColor: 'transparent',
	}
});

export default Input;
