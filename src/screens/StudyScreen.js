import React, { Component } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button } from 'react-native-elements';
import { Text } from 'native-base';
import { setCurrentCard } from '../actions';
import { getStudyCards } from '../selectors';
import FlipDeck from '../components/Deck';
import XRayDeck from '../components/DeckTwo';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const mapStateToProps = state => ({
    cards: getStudyCards(state),
    useAllCards: state.useAllSwitch,
    XRayDeck: state.XRayDeck
});

@connect(mapStateToProps, { setCurrentCard })
export default class StudyScreen extends Component {
    renderCardFront = item => {
        return (
            <Card
                key={item.id}
                containerStyle={[styles.cardContainer, styles.cardShadow]}
                wrapperStyle={styles.innerWrapper}
            >
                <Text style={styles.titleStyle}>{item.question}</Text>
                {item.image && (
                    <Image style={{ height: 300, width: 300 }} source={{ uri: item.image.uri }} />
                )}
            </Card>
        );
    };
    renderCardBack = item => {
        return (
            <Card
                key={item.id}
                containerStyle={[styles.cardContainer, styles.cardShadow]}
                wrapperStyle={styles.innerWrapper}
            >
                <Text style={styles.titleStyle}>{item.answer}</Text>
            </Card>
        );
    };
    renderNoMoreCards = () => {
        return (
            <Card title="No Cards" containerStyle={styles.cardShadow}>
                <Text style={{ marginBottom: 10, textAlign: 'center' }}>
                    {this.props.useAllCards
                        ? 'Create some cards to study!'
                        : 'Either Study with all cards or add cards into your active lists!'}
                </Text>
                <Button
                    backgroundColor={'rgb(30, 34, 54)'}
                    title="Alright!"
                    onPress={() =>
                        this.props.useAllCards
                            ? this.props.nav.go('CreateCard')
                            : this.props.nav.go('CardLists')
                    }
                />
            </Card>
        );
    };
    render() {
        let Deck = !this.props.XRayDeck ? FlipDeck : XRayDeck;
        return (
            <Deck
                setCurrentCard={this.props.setCurrentCard}
                data={this.props.cards}
                renderCardFront={this.renderCardFront}
                renderCardBack={this.renderCardBack}
                renderEmpty={this.renderNoMoreCards}
            />
        );
    }
}

const styles = StyleSheet.create({
    titleStyle: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'rgb(51, 51, 57)'
    },
    cardContainer: {
        height: SCREEN_HEIGHT * 0.8
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 3
    },
    innerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%'
    }
});
