import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

// Datos de prueba
const MOCK_USERS = [
  {
    email: 'test@test.com',
    password: '123456',
    name: 'Usuario Prueba'
  }
];

class AuthService {
  async signIn(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      throw error;
    }
  }

  async signUp(email, password, userType = 'regular') {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Crear perfil de usuario en Firestore
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          email,
          userType,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      return userCredential.user;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error en cierre de sesión:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return auth().currentUser;
  }

  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }
}

export default AuthService; 