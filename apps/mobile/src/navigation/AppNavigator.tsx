import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens (will be created)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import InvoiceListScreen from '../screens/invoices/InvoiceListScreen';
import InvoiceCreateScreen from '../screens/invoices/InvoiceCreateScreen';
import ExpenseListScreen from '../screens/expenses/ExpenseListScreen';
import ExpenseCreateScreen from '../screens/expenses/ExpenseCreateScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Invoices: undefined;
  Expenses: undefined;
  Settings: undefined;
};

export type InvoiceStackParamList = {
  InvoiceList: undefined;
  InvoiceCreate: undefined;
};

export type ExpenseStackParamList = {
  ExpenseList: undefined;
  ExpenseCreate: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const InvoiceStack = createNativeStackNavigator<InvoiceStackParamList>();
const ExpenseStack = createNativeStackNavigator<ExpenseStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const InvoiceNavigator = () => (
  <InvoiceStack.Navigator>
    <InvoiceStack.Screen name="InvoiceList" component={InvoiceListScreen} options={{ title: 'Invoices' }} />
    <InvoiceStack.Screen name="InvoiceCreate" component={InvoiceCreateScreen} options={{ title: 'Create Invoice' }} />
  </InvoiceStack.Navigator>
);

const ExpenseNavigator = () => (
  <ExpenseStack.Navigator>
    <ExpenseStack.Screen name="ExpenseList" component={ExpenseListScreen} options={{ title: 'Expenses' }} />
    <ExpenseStack.Screen name="ExpenseCreate" component={ExpenseCreateScreen} options={{ title: 'Add Expense' }} />
  </ExpenseStack.Navigator>
);

const MainNavigator = () => (
  <MainTab.Navigator screenOptions={{ headerShown: false }}>
    <MainTab.Screen name="Dashboard" component={DashboardScreen} />
    <MainTab.Screen name="Invoices" component={InvoiceNavigator} />
    <MainTab.Screen name="Expenses" component={ExpenseNavigator} />
    <MainTab.Screen name="Settings" component={SettingsScreen} />
  </MainTab.Navigator>
);

const AppNavigator: React.FC = () => {
  // TODO: Add authentication state management
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
