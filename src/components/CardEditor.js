import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, LayoutAnimation, UIManager } from 'react-native';
import { Form, Item, Input, Label, Text } from 'native-base';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { ImagePicker } from 'expo';

import { updateCard } from '../actions/cardActions';

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

const greyColor = 'rgb(143, 143, 143)';
const imageButtonColor = 'rgb(55, 90, 119)';
const saveButtonColor = 'rgb(18, 183, 244)';

@connect(null, { updateCard })
class CardEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: this.props.cardProps.image || null,
            question: this.props.cardProps.question || '',
            answer: this.props.cardProps.answer || ''
        };
    }
    setImage(image) {
        this.setState(state => ({ ...state, image }));
    }
    chooseImage = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false
        });

        if (image.cancelled) return;
        console.log(image);
        this.setImage(image);
    };
    // takePhoto = async () => {
    // 	let image = await ImagePicker.launchCameraAsync({ allowsEditing: false })
    //
    // 	if(image.cancelled) return;
    // 	this.setImage(image)
    // }
    componentWillUpdate() {
        LayoutAnimation.spring();
    }
    onSavePress = () => {
        const { question, answer, image } = this.state;
        const { id } = this.props.cardProps;

        this.props.updateCard({ question, answer, image, id });
        this.props.collapse && this.props.collapse();
    };
    render() {
        const { question, answer, image } = this.state;

        return (
            <Form style={styles.container}>
                {this.props.isListItem && (
                    <Button
                        borderRadius={30}
                        containerViewStyle={styles.button}
                        title="Cancel"
                        backgroundColor={greyColor}
                        onPress={this.props.collapse}
                    />
                )}
                <Item floatingLabel>
                    <Label>Text for card front</Label>
                    <Input
                        maxLength={300}
                        value={question}
                        onChangeText={question => this.setState({ question })}
                    />
                </Item>
                <Item floatingLabel>
                    <Label>Text for card back</Label>
                    <Input
                        maxLength={300}
                        value={answer}
                        onChangeText={answer => this.setState({ answer })}
                    />
                </Item>
                <Text style={{ alignSelf: 'center', marginVertical: 5 }}>Image</Text>
                {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                {!image && (
                    <View style={styles.buttonGroup}>
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
                        containerStyle={styles.imageButton}
                        title="Remove Image"
                        onPress={() => this.setImage(null)}
                    />
                )}
                <View style={styles.buttonGroup}>
                    <Button
                        borderRadius={30}
                        containerViewStyle={styles.button}
                        style={styles.button}
                        title="Save"
                        backgroundColor={saveButtonColor}
                        onPress={this.onSavePress}
                    />
                    {!this.props.isListItem && (
                        <Button
                            borderRadius={30}
                            containerViewStyle={styles.button}
                            style={styles.button}
                            title="Cancel"
                            onPress={this.props.onCancel}
                        />
                    )}
                </View>
            </Form>
        );
    }
}

CardEditor.defaultProps = {
    cardProps: {
        question: '',
        answer: '',
        image: null
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        height: '100%',
        width: '100%'
    },
    text: {
        fontSize: 20
    },
    label: {
        marginVertical: 10
    },
    imageButton: {
        flex: 1,
        borderRadius: 30
    },
    button: {
        flex: 1,
        borderRadius: 30
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    image: {
        height: 300,
        width: 300,
        margin: 5,
        alignSelf: 'center',
        flex: 1
    }
});

export default CardEditor;
