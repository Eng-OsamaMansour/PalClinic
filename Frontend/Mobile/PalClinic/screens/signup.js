import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import signin from "../api/signup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!email || !name || !password || !confirmPassword || !phoneNumber) {
        console.log(email, name, password, confirmPassword, phoneNumber);
      showMessage({
        message: "تنبيه",
        description: "الرجاء تعبئة جميع الحقول",
        type: "danger",
        backgroundColor: "#D64545",
        color: "white",
      });
      return;
    }
    if (password !== confirmPassword) {
      showMessage({
        message: "تنبيه",
        description: "كلمة المرور غير متطابقة",
        type: "danger",
        backgroundColor: "#D64545",
        color: "white",
      });
      return;
    }

    const response = await signin(
      email,
      password,
      name,
      phoneNumber,
      confirmPassword
    );

    if (response.ok) {
      navigation.navigate("Login");
      showMessage({
        message: "تنبيه",
        description: "تم إنشاء الحساب بنجاح",
        type: "success",
        backgroundColor: "#45D645",
        color: "white",
      });
    } else {
      showMessage({
        message: "خطأ",
        description: "حدث خطأ أثناء إنشاء الحساب",
        type: "danger",
        backgroundColor: "#D64545",
        color: "white",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.image}
        />
        <TextInput
          placeholder="الاسم"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="رقم الهاتف"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
        />
        <TextInput
          placeholder="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="تأكيد كلمة المرور"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>إنشاء حساب</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>لديك حساب؟ تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  loginLink: {
    marginTop: 10,
    textAlign: "center",
  },
  loginLinkText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Signup;
