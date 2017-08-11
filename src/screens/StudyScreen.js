import React from 'react';
import { Text, StyleSheet, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button } from 'react-native-elements';

import { setCurrentCard } from '../actions';
import { getStudyCards } from '../selectors';
import Deck from '../components/Deck';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const mapStateToProps = state => ({
    cards: getStudyCards(state),
    useAllCards: state.useAllSwitch
});

@connect(mapStateToProps, { setCurrentCard })
export default class StudyScreen extends React.PureComponent {
    renderCardFront = item => {
        return (
            <Card
                key={item.id}
                containerStyle={styles.cardContainer}
                wrapperStyle={styles.innerWrapper}
            >
                <Text style={styles.titleStyle}>
                    {item.question}
                </Text>
                {item.image &&
                    <Image
                        style={{ height: 300, width: 300 }}
                        source={{ uri: item.image.uri }}
                    />}
            </Card>
        );
    };
    renderCardBack(item) {
        return (
            <Card
                key={item.id}
                containerStyle={styles.cardContainer}
                wrapperStyle={styles.innerWrapper}
            >
                <Text style={styles.titleStyle}>
                    {item.answer}
                </Text>
            </Card>
        );
    }
    renderNoMoreCards = () => {
        return (
            <Card title="No Cards">
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
                            : this.props.nav.go('CardLists')}
                />
            </Card>
        );
    };
    render() {
        return (
            <Deck
                setCurrentCard={this.props.setCurrentCard}
                data={this.props.cards}
                renderCardFront={this.renderCardFront}
                renderCardBack={this.renderCardBack}
                renderNoMoreCards={this.renderNoMoreCards}
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
    innerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
