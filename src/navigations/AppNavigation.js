import React from "react";
import { Animated, Easing, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack'
import {createDrawerNavigator} from 'react-navigation-drawer'
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer
} from "react-navigation-redux-helpers";
import WelcomeScreen from "../screens/WelcomeScreen";
import { AppIcon, AppStyles } from "../AppStyles";
import { Configuration } from "../Configuration";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
});

const middleware = createReactNavigationReduxMiddleware(
  state => state.nav
);

// login stack
const LoginStack = createStackNavigator(
  {
    Welcome: { screen: WelcomeScreen }
  },
  {
    initialRouteName: "Welcome",
    headerMode: "float",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "red",
      headerTitleStyle: styles.headerTitleStyle
    }),
    cardStyle: { backgroundColor: "#FFFFFF" }
  }
);


// Manifest of possible screens
const RootNavigator = createStackNavigator(
  {
    LoginStack: { screen: LoginStack },
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "DrawerStack",
    transitionConfig: noTransitionConfig,
    navigationOptions: ({ navigation }) => ({
      color: "black"
    })
  }
);

const AppWithNavigationState = createReduxContainer(RootNavigator, "root");

const mapStateToProps = state => ({
  state: state.nav
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    color: "black",
    flex: 1,
  }
});

export { RootNavigator, AppNavigator, middleware };
