import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    Image,
    LayoutAnimation,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { ImagePicker } from 'expo';

import { createCard } from '../actions/cardActions';

const placeholderTextColor = 'rgb(143, 143, 143)';
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
            allowsEditing: true
        });

        if (result.cancelled) return;
        this.setState({ image: result });
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
            setTimeout(() => this.setState({ showMessage: false }), 2250);
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
            () => this.setState({ showMessage: true })
        );
    };
    render() {
        const { question, answer, image } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={styles.container}
                    activeOpacity={1}
                    onPress={Keyboard.dismiss}
                >
                    <KeyboardAvoidingView behavior="padding">
                        <FormLabel style={styles.label}>Question</FormLabel>
                        <FormInput
                            multiline
                            placeholder="Text for card front"
                            placeholderTextColor={placeholderTextColor}
                            style={styles.text}
                            maxLength={300}
                            value={question}
                            onChangeText={question =>
                                this.setState({ question })}
                        />
                        <FormLabel style={styles.label}>Answer</FormLabel>
                        <FormInput
                            multiline
                            placeholder="Text for card back"
                            placeholderTextColor={placeholderTextColor}
                            style={styles.text}
                            maxLength={300}
                            value={answer}
                            onChangeText={answer => this.setState({ answer })}
                        />
                        <FormLabel>Image</FormLabel>
                        {image &&
                            <Image
                                source={{ url: image.uri }}
                                style={styles.image}
                            />}
                        <View style={styles.buttons}>
                            {!image &&
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Button
                                        borderRadius={30}
                                        containerViewStyle={styles.imageButton}
                                        backgroundColor={imageButtonColor}
                                        title="Choose Image"
                                        onPress={this.chooseImage}
                                    />
                                    {/* <Button borderRadius={30} containerViewStyle={styles.imageButton} backgroundColor={imageButtonColor} title="Take Photo" onPress={this.takePhoto} /> */}
                                </View>}
                            {image &&
                                <Button
                                    borderRadius={30}
                                    backgroundColor="rgb(143, 143, 143)"
                                    title="Remove Image"
                                    onPress={() =>
                                        this.setState({ image: null })}
                                />}
                        </View>
                        <Button
                            borderRadius={30}
                            containerViewStyle={styles.saveButton}
                            title="Save"
                            backgroundColor={saveButtonColor}
                            onPress={this.onSavePress}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
                {this.state.showMessage &&
                    <View style={styles.savedMessage}>
                        <Text style={styles.savedMessageText}>Saved!</Text>
                    </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 20
    },
    label: {
        marginVertical: 10
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
