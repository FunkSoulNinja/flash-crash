import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Button } from 'react-native-elements';
import transformUtil from './util';

//TODO: fix layout (backface is using height of frontface)

class FoldView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expanded: false,
			frontOriginY: 0,
			backOriginY: 0
		};

		this.animateFrontface = new Animated.Value(0);
		this.animateBackface = new Animated.Value(-180);
		this.animateFrontface.addListener(({ value }) =>
			this.flushTransform(this.frontfaceRef, value, this.state.frontOriginY ));
		this.animateBackface.addListener(({ value }) => this.flushTransform(this.backfaceRef, value, this.state.backOriginY ));
	}
	flushTransform(ref, dx, y) {
    // Matrix multiplication is not commutative
		const matrix = transformUtil.rotateX(dx);
		transformUtil.origin(matrix, { x: 0, y, z: 0 });

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
		this.setState({ frontOriginY: height / 2, backOriginY: -height / 2, baseHeight: height }, () => {
			this.flushTransform(this.frontfaceRef, this.animateFrontface.__getValue(), this.state.frontOriginY);
			this.flushTransform(this.backfaceRef, this.animateBackface.__getValue(), this.state.backOriginY);
		});
	}
	renderFrontFace() {
		return (
			<Animated.View
				ref={ref => this.frontfaceRef = ref}
				style={[styles.face]}
				onLayout={this.handleLayout}
			>
				{this.props.frontface()}
			</Animated.View>
		)
	}
	renderBackFace() {
		return (
			<Animated.View
				ref={ref => this.backfaceRef = ref}
				style={[styles.face, { transform: [{ perspective: 850 }] }]}
				// onLayout={this.handleLayout}
				>
				{this.props.backface()}
			</Animated.View>
		)
	}
	flipDown = () => {
		Animated.parallel([
			Animated.timing(this.animateFrontface, {
				toValue: this.state.expanded ? 0 : 180,
				duration: this.props.flipDuration
			}),
			Animated.timing(this.animateBackface, {
				toValue: this.state.expanded ? -180 : 0,
				duration: this.props.flipDuration
			})
		]).start(() => this.setState({ expanded: !this.state.expanded }));
	}
	render() {
		return (
			<View style={styles.container}>
				<Button title="flip" onPress={this.flipDown} />
				{this.renderFrontFace()}
				{this.renderBackFace()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {

	},
	face: {
		backfaceVisibility: 'hidden',
	}
});

FoldView.defaultProps = {
	flipDuration: 300
};

export default FoldView;
