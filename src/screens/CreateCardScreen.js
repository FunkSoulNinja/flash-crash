import React, { Component } from 'react';
import { View, StyleSheet, Image, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { Form, Item, Input, Label, Container, Content, Text } from 'native-base';
import { ImagePicker } from 'expo';

import { createCard } from '../actions/cardActions';

// const placeholderTextColor = 'rgb(143, 143, 143)';
const imageButtonColor = 'rgb(55, 90, 119)';
const saveButtonColor = 'rgb(18, 183, 244)';

//TODO: Add form inputs to redux so screen switch doesn't wipe text
//TODO: add preview screen

//TODO: Add animated "Saved!" message after save button is pressed

@connect(null, { createCard })
export default class CreateCardScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null,
            question: '',
            answer: '',
            showMessage: false
        };
    }
    chooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false
        });

        if (result.cancelled) return;
        this.setState(state => ({ ...state, image: result }));
    };
    // takePhoto = async () => {
    // 	let result = await ImagePicker.launchCameraAsync({ allowsEditing: true })
    //
    // 	if(result.cancelled) return;
    // 	this.setState({ image: result });
    // }
    componentWillUpdate() {
        LayoutAnimation.configureNext({
            duration: 1000,
            create: {
                type: LayoutAnimation.Types.spring,
                property: LayoutAnimation.Properties.scaleXY,
                springDamping: 0.7
            },
            update: {
                type: LayoutAnimation.Types.spring,
                springDamping: 0.7
            }
        });
    }
    componentDidUpdate() {
        if (this.state.showMessage) {
            setTimeout(() => this.setState(state => ({ ...state, showMessage: false })), 1500);
        }
    }
    onSavePress = () => {
        const { question, answer, image } = this.state;

        this.props.createCard({ question, answer, image });
        this.setState(
            {
                question: '',
                answer: '',
                image: null
            },
            () => this.setState(state => ({ ...state, showMessage: true }))
        );
    };
    render() {
        const { question, answer, image } = this.state;

        return (
            <Container>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Question</Label>
                            <Input
                                maxLength={300}
                                value={question}
                                onChangeText={question => this.setState({ question })}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Answer</Label>
                            <Input
                                maxLength={300}
                                value={answer}
                                onChangeText={answer => this.setState({ answer })}
                            />
                        </Item>
                        <Text style={styles.centerLabel}>Image</Text>
                    </Form>
                    {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                    <View style={styles.buttons}>
                        {!image && (
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Button
                                    borderRadius={30}
                                    containerViewStyle={styles.imageButton}
                                    backgroundColor={imageButtonColor}
                                    title="Choose Image"
                                    onPress={this.chooseImage}
                                />
                                {/* <Button borderRadius={30} containerViewStyle={styles.imageButton} backgroundColor={imageButtonColor} title="Take Photo" onPress={this.takePhoto} /> */}
                            </View>
                        )}
                        {image && (
                            <Button
                                borderRadius={30}
                                backgroundColor="rgb(143, 143, 143)"
                                title="Remove Image"
                                onPress={() => this.setState({ image: null })}
                            />
                        )}
                    </View>
                    <Button
                        borderRadius={30}
                        containerViewStyle={styles.saveButton}
                        title="Save"
                        backgroundColor={saveButtonColor}
                        onPress={this.onSavePress}
                    />
                </Content>
                {this.state.showMessage && (
                    <View style={styles.savedMessage}>
                        <Text style={styles.savedMessageText}>Saved!</Text>
                    </View>
                )}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    centerLabel: {
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 20,
        color: 'rgb(100, 100, 100)'
    },
    imageButton: {
        flex: 1
    },
    saveButton: {
        marginBottom: 10
    },
    buttons: {
        justifyContent: 'center',
        marginVertical: 10
    },
    savedMessage: {
        position: 'absolute',
        backgroundColor: 'rgba(64, 64, 64, .8)',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    savedMessageText: {
        fontSize: 60,
        textAlign: 'center',
        color: 'white',
        fontWeight: '100'
    },
    image: {
        height: 300,
        width: 300,
        margin: 5,
        alignSelf: 'center'
    }
});
