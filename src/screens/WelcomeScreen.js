import React from "react";
import Button from "react-native-button";
import { Text, View, StyleSheet, FlatList, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { AppStyles } from "../AppStyles";
import { AsyncStorage, ActivityIndicator } from "react-native";
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            fav : []
        };
    }

    async componentDidMount() {
        await fetch('https://data.nasa.gov/resource/y77d-th95.json')
            .then(response => response.json() )
            .then(data => {
                this.setState({user : data})
                this.setState({filteredData : data})                
            } )
            .catch(error => console.log(error));
        const fav = await AsyncStorage.getItem('@fav'); 
        this.setState({fav : JSON.parse(fav)})
        console.log(this.state.fav);
        this.setState({isLoading : false});
    }
    async searchVal(searchText){
        const searched = searchText.toLowerCase();
        await this.setState(prevState => ({
            searchVal: searched,
            filteredData: prevState.user.filter(item =>
                item.name.toLowerCase().includes(searched) || item.id.toLowerCase().includes(searched)
            ),
        }));
    }

    async fav(item) {
        let ind = this.state.fav.findIndex(obj => obj.id === item.id)
        const currentScores = this.state.fav;
        if(ind >= 0){
            const newScores = currentScores.filter((obj) =>obj.id !== item.id);
            await this.setState({ fav: newScores }, function(){
            });
        }
        else{
            const newScores = currentScores.concat(item);
            await this.setState({ fav: newScores }, function(){
            });
        }
        await AsyncStorage.setItem('@fav', JSON.stringify(this.state.fav));
    }
    render() {
        const renderItem = ({ item }) => 
        {
            return (            
                <Item 
                    item={item} 
                />
            )
        };
        const Item = ({ item }) => 
            (
            <TouchableOpacity style={styles.item}
                activeOpacity={1}
            >
                <View style={styles.flexContainer}>
                    <Text style={{width : "50%"}}>Name : {item.name}</Text>
                    <Text style={{width : "50%"}}>ID : {item.id}</Text>
                </View>
                <View style={styles.flexContainer}>
                    <Text style={{width : "50%"}}>NameType : {item.nametype}</Text>
                    <Text style={{width : "50%"}}>Recclass : {item.recclass}</Text>
                </View>
                <View style={styles.flexContainer}>
                    <Text style={{width : "50%"}}>Mass(g) : {item.mass}</Text>
                    <Text style={{width : "50%"}}>Fall : {item.fall}</Text>
                </View>
                <View style={styles.flexContainer}>
                    <Text style={{width : "80%"}}>Year : {item.year}</Text>
                    <TouchableOpacity onPress={() => this.fav(item)}>
                        {this.state.fav.findIndex(obj => obj.id == item.id) < 0 ? 
                            <Image
                                source={{uri : 'https://icons-for-free.com/iconfiles/png/512/heart+like+love+valentine+icon-1320084901929215407.png'}}
                                style={{width : 20, height : 20}}
                            /> :
                            <Image
                                source={{uri : 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png'}}
                                style={{width : 20, height : 20}}
                            />
                        }
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
        if (this.state.isLoading == true) {
            return (
                <ActivityIndicator
                    style={styles.spinner}
                    size="large"
                    color={AppStyles.color.tint}
                />
            );
        }
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <View>
                        <TextInput 
                            onChangeText={(value) => {
                                this.searchVal(value);
                            }}
                            placeholder="Search by name or id" style={styles.seachBox}></TextInput>
                        <FlatList
                            data={this.state.filteredData}
                            renderItem={renderItem}
                            // keyExtractor={item => item.id}
                            keyExtractor={(item, index) => item.id} 
                            style={{marginBottom : 10}}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop : 40,
    },
    item : {
        borderWidth : 1,
        borderColor : '#191A1C',
        padding : 5,
    },
    flexContainer : {
        flexDirection : 'row',
        alignItems : 'center',
        padding : 5,
        // justifyContent : ""
    },
    seachBox : {
        borderColor : '#939393',
        padding : 10,
        borderWidth : 1,
        borderRadius : 10,
        marginBottom : 10,
    },
    scrollContainer : {
        padding : 10,
    },
    logo: {
        width: 200,
        height: 200
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: "bold",
        color: AppStyles.color.tint,
        marginTop: 20,
        textAlign: "center",
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },
    loginContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.tint,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30
    },
    loginText: {
        color: AppStyles.color.white
    },
    signupContainer: {
        width: AppStyles.buttonWidth.main,
        backgroundColor: AppStyles.color.white,
        borderRadius: AppStyles.borderRadius.main,
        padding: 8,
        borderWidth: 1,
        borderColor: AppStyles.color.tint,
        marginTop: 15
    },
    signupText: {
        color: AppStyles.color.tint
    },
    spinner: {
        marginTop: 200
    }
});

export default WelcomeScreen;
