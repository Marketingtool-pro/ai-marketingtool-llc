import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Clipboard, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Force hide the splash screen so the user can see the error!
    setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 500);
  }

  copyToClipboard = () => {
    const errorString = `Error: ${this.state.error?.toString()}\n\nStack: ${this.state.errorInfo?.componentStack}`;
    Clipboard.setString(errorString);
    alert('Error details copied to clipboard!');
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.header}>Fatal App Error 🚨</Text>
            <Text style={styles.instruction}>Please take a screenshot of this page or copy the error and send it to the developer.</Text>
            
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{this.state.error && this.state.error.toString()}</Text>
            </View>
            
            <Text style={styles.stackHeader}>Component Stack:</Text>
            <View style={styles.stackBox}>
              <Text style={styles.stackText}>
                {this.state.errorInfo ? this.state.errorInfo.componentStack : 'No stack trace available.'}
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={this.copyToClipboard}>
              <Text style={styles.buttonText}>Copy Error Details</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children; 
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060b28' },
  content: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#ff4444', marginBottom: 10 },
  instruction: { color: 'white', marginBottom: 20 },
  errorBox: { backgroundColor: 'rgba(255,0,0,0.1)', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#ff4444' },
  errorText: { color: '#ffbbbb', fontFamily: 'Courier' },
  stackHeader: { color: 'white', fontWeight: 'bold', marginBottom: 10 },
  stackBox: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 15, borderRadius: 8, marginBottom: 20 },
  stackText: { color: '#aaa', fontSize: 10, fontFamily: 'Courier' },
  button: { backgroundColor: '#7C3AED', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});

export default ErrorBoundary;
