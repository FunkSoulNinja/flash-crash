import React, { Component } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';

const SWIPE_DISTANCE = 90;

class Flip extends Component {
	componentWillMount() {
		this.flipPosition = new Animated.Value(0);
		this._flipValue = 0;
		this.flipPosition.addListener(({ value }) => {
			this._flipValue = value % 360;
		});

		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (e, gesture) => true,
			onPanResponderGrant: (e, gesture) => {
				this.flipPosition.setOffset(this._flipValue);
				this.flipPosition.setValue(0);
			},
			onPanResponderMove: (e, { dx, dy }) => {
				if(dy > 180 || dy < -180) return;
				this.flipPosition.setValue(dy);
			},
			onPanResponderRelease: (e, { dy }) => {
				if(Math.abs(dy) < SWIPE_DISTANCE) {
					Animated.spring(this.flipPosition, {
						toValue: 0
					}).start(({ finished }) => {
						if(finished) return;
						else {
							this.flipPosition.setOffset(this.getOffset());
						}
					});
				}
				else if(dy > SWIPE_DISTANCE) {
					Animated.spring(this.flipPosition, {
						toValue: 180
					}).start(({ finished }) => {
						if(finished) return;
						else {
							this.flipPosition.setOffset(this.getOffset());
						}
					});
				}
				else if(dy < -SWIPE_DISTANCE) {
					Animated.spring(this.flipPosition, {
						toValue: -180
					}).start(({ finished }) => {
						if(finished) return;
						else {
							this.flipPosition.setOffset(this.getOffset());
						}
					});
				}
			}
		});

	}
	getOffset() {
		if(Math.abs(this._flipValue) < SWIPE_DISTANCE) return 0;
		else if(this._flipValue > SWIPE_DISTANCE) return 180;
		else if(this._flipValue < -SWIPE_DISTANCE) return -180;
	}
	flipFrontCard() {
		const rotateX = this.flipPosition.interpolate({
			inputRange:[0, 180],
			outputRange: ['0deg', '180deg']
		});
		return { transform: [{ rotateX }] };
	}
	flipBackCard() {
		const rotateX = this.flipPosition.interpolate({
			inputRange:[0, 180],
			outputRange: ['180deg', '360deg']
		});
		return { transform: [{ rotateX }] };
	}
	render() {
		return (
			<View {...this.panResponder.panHandlers}>
				<Animated.View style={[styles.flipCard, this.flipFrontCard()]}>
					<Card title='ping'>
						<Text style={styles.text}>Front</Text>
					</Card>
				</Animated.View>

				<Animated.View style={[styles.flipCard, styles.flipCardBack, this.flipBackCard()]}>
					<Card title='ping'>
						<Text style={styles.text}>Back</Text>
					</Card>
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	flipCard: {
		backfaceVisibility: 'hidden',
		width: 250,
	},
	flipCardBack: {
		position: 'absolute'
	},
	button: {
		backgroundColor: 'grey',
		margin: 20
	},
	text: {
		fontSize: 30,
		paddingTop: 50,
		paddingBottom: 50
	}
});

export default Flip;
