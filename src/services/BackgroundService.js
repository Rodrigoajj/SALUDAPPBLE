// Comenta o elimina esta línea
// import BackgroundFetch from "react-native-background-fetch";

// Por ahora, podemos tener una versión simplificada:
class BackgroundService {
  static async initialize() {
    console.log('Background service initialized');
  }

  static async startBackgroundTask() {
    console.log('Background task started');
  }
}

export default BackgroundService; 