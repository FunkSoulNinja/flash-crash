import Expo from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, LayoutAnimation } from 'react-native';
import { Button } from 'react-native-elements';

import transformUtil from './util';

class FoldView extends Component {
	constructor(props) {
		super(props);

		this.state = { expanded: false, x: 0, frontOriginY: 0, backOriginY: 0, baseHeight: 0 };

		this.animateFront = new Animated.Value(this.props.flipStartPosition || 180);
		this.animateFront.addListener(({ value }) => this.flushTransform(this.frontViewRef, value, this.state.frontOriginY));

		// this.animateBack = new Animated.Value(-180);
		// this.animateBack.addListener(({ value }) => this.flushTransform(this.backViewRef, value, this.state.backOriginY));
	}
	componentWillUpdate() {
		LayoutAnimation.spring();
	}
	onPress = () => {
		// Animated.timing(this.animate, {
		// 	toValue: this.state.expanded ? 360 : 0,
		// 	duration: 2000
		// }).start(() => this.setState({ expanded: !this.state.expanded }));

		// let baseHeight = this.state.baseHeight;
		//
		// if(this.state.expanded) {
		// 	console.log(baseHeight);
		// } else console.log(baseHeight * 2);
		if(!this.state.expanded) {
			this.setState({ expanded: true }, () => {
				Animated.parallel([
					Animated.timing(this.animateFront, {
						toValue: 0,
						duration: 500
					}),
					// Animated.timing(this.animateBack, {
					// 	toValue: this.state.expanded ? 0 : -180,
					// 	friction: 2,
					// 	duration: 1000
					// })
				]).start();
			});
		} else {
			Animated.timing(this.animateFront, {
				toValue: -180,
				duration: 300
			}).start(() => this.setState({ expanded: false }));
		}

	}
	flushTransform(ref, dx: number, y: number) {
    // Matrix multiplication is not commutative
		const matrix = transformUtil.rotateX(dx);
		transformUtil.origin(matrix, { x: 0, y, z: 0 });

		// const perspective = this.props.perspective || 1000;

		ref.setNativeProps({
			style: {
				transform: [
					{ perspective: 850 },
					{ matrix },
				],
			},
		});
	}
	handleLayout = (e) => {
		const { height } = e.nativeEvent.layout;
		this.setState({ frontOriginY: -height / 2, backOriginY: -height / 2, baseHeight: height }, () => {
			this.flushTransform(this.frontViewRef, this.animateFront.__getValue(), this.state.frontOriginY);
			// this.flushTransform(this.backViewRef, this.animateBack.__getValue(), this.state.backOriginY);
		});
	}
	render() {
		const spacerStyle = { zIndex: -10, height: !this.state.expanded ? 0 : this.state.baseHeight };
		return (
            <View style={styles.container}>
				<Button color="rgb(112, 139, 98)" title="I'm a button" onPress={this.onPress}/>

				<View style={spacerStyle}/>
				<View ref={ref => this.frontViewRef = ref} onLayout={this.handleLayout} style={styles.flipDown}>
					<Button title="hello" onPress={this.onPress} color="blue" style={{ backgroundColor: 'rgb(14, 55, 125)' }}/>
					<Button title="hello" onPress={this.onPress} color="blue" style={{ backgroundColor: 'rgb(14, 55, 125)' }}/>
				</View>
				<Button color="rgb(112, 139, 98)" title="I'm a button" onPress={this.onPress} />



				{/* <View ref={ref => this.backViewRef = ref}>
					<Button title="hello" color="red" onPress={this.onPress} style={styles.flipDown} />
				</View> */}
            </View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	flipDown: {
		zIndex: -10,
		width: 110,
		backfaceVisibility: 'hidden',
		position: 'absolute',
	},
	text: {
		fontSize: 50
	},
});

export default FoldView;
