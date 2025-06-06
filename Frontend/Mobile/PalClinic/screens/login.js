import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import login from "../api/login";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import FlashMessage, { showMessage } from "react-native-flash-message";
import {
  setTokens,
  getAccessToken,
  getRefreshToken,
} from "../config/tokenManager";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const handleLogin = async () => {
    if (email === "" || password === "") {
      showMessage({
        message: "تنبيه",
        description: "الرجاء ادخال البريد الإلكتروني وكلمة المرور",
        type: "danger",
        backgroundColor: "#D64545",
        color: "white",
      });
      return;
    }

    const response = await login(email, password);
    const data = await response.json();
    if (!response.ok) {
      showMessage({
        message: "خطأ",
        description: "كلمة المرور او البريد الإلكتروني غير صحيح",
        type: "danger",
        backgroundColor: "#D64545",
        color: "white",
      });
      return;
    }

    if (data.role !== "patient") {
      showMessage({
        message: "تنبيه",
        description: "الرجاء تسجيل الدخول من المتصفح، هذا التطبيق مخصص للمرضى",
        type: "danger",
        backgroundColor: "#D64545",
        color: "white",
      });
      return;
    }

    showMessage({
      message: "نجاح",
      description: "تم تسجيل الدخول بنجاح",
      type: "success",
      backgroundColor: "#45D645",
      color: "white",
    });

    await setTokens(data.access, data.refresh);
    navigation.navigate("Main");
    setEmail("");
    setPassword("");
  };

  return (
    <SafeAreaView style={logInStyle.container}>
      <View style={logInStyle.logo}>
        <Image
          source={require("../assets/images/logo.png")}
          style={logInStyle.image}
        />
        <TextInput
          placeholder="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          style={logInStyle.input}
        />
        <TextInput
          placeholder="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={logInStyle.input}
        />
        <TouchableOpacity onPress={handleLogin} style={logInStyle.button}>
          <Text style={logInStyle.buttonText}>تسجيل الدخول</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={logInStyle.createAccount}
        >
          <Text style={logInStyle.createAccountText}>انشاء حساب</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const logInStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  logo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    textAlign: "right",
  },
  button: {
    backgroundColor: "#006C9A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  createAccount: {
    marginTop: 10,
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});
