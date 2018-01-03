import React, { Component } from 'react';
import { View, Animated, LayoutAnimation, UIManager, PanResponder, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const FLIP_THRESHOLD = 80;
const friction = 4;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SWIPE_THRESHOLD_X = 0.25 * SCREEN_WIDTH;
const SWIPE_THRESHOLD_Y = 0.25 * SCREEN_HEIGHT;
const SWIPEOUT_DURATION = 200;

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

class Deck extends Component {
    constructor(props) {
        super(props);

        this.currentSwipeDirection = null;
        this.inSwipe = false;
        this.swipeDirection = null;

        this.flipPosition = new Animated.Value(0);
        this._flipValue = 0;
        this.flipPosition.addListener(({ value }) => {
            this._flipValue = value % 360;
        });

        this.position = new Animated.ValueXY();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.flipPosition.setOffset(this._flipValue);
                this.flipPosition.setValue(0);
            },
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease
        });
        this.state = {
            index: 0,
            cardWidth: 0,
            cardHeight: 0,
            overlayWidth: 0,
            overlayHeight: 0
        };
    }
    onPanResponderMove = (event, { dx, dy, moveX, x0, y0, moveY }) => {
        const travelX = Math.abs(x0 - moveX);
        const travelY = Math.abs(y0 - moveY);

        if (!this.inSwipe && travelY >= travelX) {
            this.currentSwipeDirection = 'vertical';
            this.inSwipe = true;
        } else if (!this.inSwipe && travelX > travelY) {
            this.currentSwipeDirection = 'horizontal';
            this.inSwipe = true;
        }
        let [x, y] = [0, 0];

        if (this.currentSwipeDirection === 'vertical') {
            [x, y] = [0, dy];
        } else {
            [x, y] = [dx, 0];
        }

        let translationY = this.currentSwipeDirection === 'vertical' ? 0 : dy;
        this.position.setValue({ x, y: translationY });

        LayoutAnimation.configureNext({
            duration: 100,
            update: { type: LayoutAnimation.Types.easeInEaseOut }
        });

        if (Math.abs(dy) > 180) return;
        this.flipPosition.setValue(y);
    };
    onPanResponderRelease = (evt, { dx, dy, vy, vx }) => {
        if (
            this.currentSwipeDirection === 'horizontal' &&
            dx > SWIPE_THRESHOLD_X
            // || vx > .7
        ) {
            return this.forceSwipe('right');
        } else if (
            this.currentSwipeDirection === 'horizontal' &&
            dx < -SWIPE_THRESHOLD_X
            // || vx < -.7
        ) {
            return this.forceSwipe('left');
        }
        this.resetPosition();
        this.finishFlippingCard(dy, vy);
        this.inSwipe = false;
    };
    finishFlippingCard(dy, vy) {
        if (this.currentSwipeDirection === 'horizontal') return;
        let toValue = 0;

        if (Math.abs(dy) < FLIP_THRESHOLD && Math.abs(vy) < 0.8) {
            toValue = 0;
        } else if (dy > FLIP_THRESHOLD || vy >= 0.8) {
            toValue = 180;
        } else if (dy < -FLIP_THRESHOLD || vy <= -0.8) {
            toValue = -180;
        }

        Animated.spring(this.flipPosition, {
            toValue,
            friction
        }).start(({ finished }) => {
            if (finished) return;
            this.rectify();
        });
    }
    rectify() {
        let newOffset = 0;
        const flipAmount = Math.abs(this._flipValue);

        if (flipAmount < FLIP_THRESHOLD || flipAmount > FLIP_THRESHOLD * 3) newOffset = 0;
        else newOffset = 180;

        this.flipPosition.setOffset(newOffset);
    }
    resetPosition() {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction
        }).start();
    }
    resetDeck() {
        this.setState({ index: 0 });
    }
    componentWillUpdate() {
        this.swipeDirection = null;
        LayoutAnimation.spring();
    }
    componentDidUpdate() {
        if (this.props.data[this.state.index])
            this.props.setCurrentCard(this.props.data[this.state.index].id);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }
    forceSwipe(direction) {
        const X_MOVE = SCREEN_WIDTH * 1.2;
        const Y_MOVE = SCREEN_HEIGHT * 1.2;
        let [x, y] = [0, 0];

        if (direction === 'left') x = -X_MOVE;
        else if (direction === 'right') x = X_MOVE;
        else if (direction === 'down') y = Y_MOVE;
        else if (direction === 'up') y = -Y_MOVE;

        Animated.timing(this.position, {
            toValue: { x, y },
            duration: SWIPEOUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }
    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

        this.flipPosition.setOffset(0);
        this.flipPosition.setValue(0);
        this.position.setValue({ x: 0, y: 0 });
        this._flipValue = 0;

        if (this.state.index === this.props.data.length - 1) {
            return this.setState({ index: 0 });
        }
        this.setState({ index: this.state.index + 1 });
    }
    getRotationStyle() {
        const position = this.position;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return rotate;
    }
    getAnimationStyle(cardSide) {
        const rotateX = this.flipPosition.interpolate({
            inputRange: [0, 180],
            outputRange: cardSide === 'front' ? ['0deg', '180deg'] : ['180deg', '360deg']
        });
        return {
            ...this.position.getLayout(),
            transform: [{ perspective: 1600 }, { rotateX }, { rotate: this.getRotationStyle() }]
        };
    }
    handleLayout = e => {
        if (this.state.cardWidth) return;
        const { width, height } = e.nativeEvent.layout;
        this.setState({ cardWidth: width, cardHeight: height });
    };
    renderCards() {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderEmpty();
        }

        return this.props.data
            .map((item, itemIndex) => {
                if (itemIndex < this.state.index) return null;

                const isCurrentCard = itemIndex === this.state.index;

                if (isCurrentCard) {
                    return (
                        <View {...this.panResponder.panHandlers} key={item.id}>
                            <Animated.View
                                style={[styles.cardStyle, this.getAnimationStyle('front')]}
                                onLayout={this.handleLayout}
                            >
                                {this.props.renderCardFront(item)}
                                {/* {this.renderOverlayText()} */}
                            </Animated.View>

                            <Animated.View
                                style={[styles.cardStyle, this.getAnimationStyle('back')]}
                            >
                                {this.props.renderCardBack(item)}
                                {/* {this.renderOverlayText()} */}
                            </Animated.View>
                        </View>
                    );
                }
                if (itemIndex > this.state.index + 3) return null;
                return (
                    <View
                        key={item.id}
                        style={{
                            top: 40 * (itemIndex - this.state.index),
                            zIndex: -itemIndex,
                            transform: [
                                {
                                    scale: 1 - 0.05 * (itemIndex - this.state.index)
                                }
                            ]
                        }}
                    >
                        <Animated.View style={[styles.cardStyle]}>
                            {this.props.renderCardFront(item)}
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.cardStyle,
                                {
                                    backfaceVisibility: 'hidden',
                                    transform: [{ rotateX: '180deg' }]
                                }
                            ]}
                        >
                            {this.props.renderCardBack(item)}
                        </Animated.View>
                    </View>
                );
            })
            .reverse();
    }
    render() {
        return <View style={styles.container}>{this.renderCards()}</View>;
    }
    handleOverlayLayout = e => {
        if (this.state.overlayWidth) return;

        const { width, height } = e.nativeEvent.layout;
        this.setState({ overlayWidth: width, overlayHeight: height });
    };
    renderOverlayText() {
        const { cardWidth, cardHeight } = this.state;

        const color = this.position.x.interpolate({
            inputRange: [-100, -30, 0, 30, 100],
            outputRange: [
                'rgba(183, 48, 55, 1)',
                'rgba(183, 48, 55, 0)',
                'rgba(255, 255, 255, 0)',
                'rgba(51, 152, 40, 0)',
                'rgba(51, 152, 40, 1)'
            ],
            extrapolate: 'clamp'
        });

        const backgroundColor = this.position.x.interpolate({
            inputRange: [-100, -20, 0, 20, 100],
            outputRange: [
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 1)'
            ],
            extrapolate: 'clamp'
        });

        const wrongOpacity = this.position.x.interpolate({
            inputRange: [-100, -30, 0],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp'
        });
        const correctOpacity = this.position.x.interpolate({
            inputRange: [0, 30, 100],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View
                onLayout={this.handleOverlayLayout}
                style={[
                    styles.overlayContainer,
                    {
                        left: cardWidth / 2 - this.state.overlayWidth / 2,
                        top: cardHeight / 2 - this.state.overlayHeight / 2 - 100,
                        borderColor: color,
                        backgroundColor
                    }
                ]}
            >
                <Animated.Text
                    style={{
                        color,
                        backgroundColor: 'transparent',
                        fontSize: 32,
                        opacity: wrongOpacity,
                        position: 'absolute'
                    }}
                >
                    Wrong
                </Animated.Text>
                <Animated.Text
                    style={{
                        color,
                        backgroundColor: 'transparent',
                        fontSize: 32,
                        opacity: correctOpacity
                    }}
                >
                    Correct
                </Animated.Text>
            </Animated.View>
        );
    }
    renderOverlay(overlaySideRefName) {
        const { cardWidth, cardHeight } = this.state;
        const color = this.position.x.interpolate({
            inputRange: [-100, -30, 0, 30, 100],
            outputRange: [
                'rgba(183, 48, 55, 1)',
                'rgba(183, 48, 55, 0)',
                'rgba(255, 255, 255, 0)',
                'rgba(51, 152, 40, 0)',
                'rgba(51, 152, 40, 1)'
            ],
            extrapolate: 'clamp'
        });
        const backgroundColor = this.position.x.interpolate({
            inputRange: [-100, -20, 0, 20, 100],
            outputRange: [
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 1)'
            ],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View
                onLayout={this.handleOverlayLayout}
                style={[
                    styles.overlayContainer,
                    {
                        left: cardWidth / 2 - this.state.overlayWidth / 2,
                        top: cardHeight / 2 - this.state.overlayHeight / 2 - 50,
                        borderColor: color,
                        backgroundColor
                    }
                ]}
            />
        );
    }
}

Deck.PropTypes = {
    renderEmpty: PropTypes.func.isRequired
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        overflow: 'hidden'
    },
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        backfaceVisibility: 'hidden'
    },
    backCard: {},
    overlayContainer: {
        padding: 10,
        position: 'absolute',
        borderWidth: 4,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

Deck.defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {},
    onSwipeUp: () => {},
    onSwipeDown: () => {}
};

export default Deck;
