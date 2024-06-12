import {Alert, Image, StatusBar, Text, View} from "react-native";
import {Input} from "@/components/input";
import {FontAwesome6, MaterialIcons} from "@expo/vector-icons";
import {colors} from "@/styles/colors";
import {Button} from "@/components/button";
import {Link, router} from "expo-router";
import {useState} from "react";
import {api} from "@/server/api"
import axios from "axios";
import {useBadgeStore} from "@/store/badge-store";
const EVENT_ID = "9E9BD979-9D10-4915-B339-3786B1634F33";
export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const badgeStore = useBadgeStore();
    async function handleRegister() {
        if (!name.trim() || !email.trim()) {
            return Alert.alert("Inscrição", "Preencha todos campos!")
        }
        
        try {
            setIsLoading(true);
            const registeredResponse = await api.post(`/api/attendees/${EVENT_ID}/register`, {
                name, email
            })
            
            if (registeredResponse.data.id) {
                const badgeResponse = await api.get(`/api/attendees/${EVENT_ID}?query=${registeredResponse.data.id}`);
                badgeStore.save(badgeResponse.data.badge);
                Alert.alert("Inscrição", "Inscrição realizada com sucesso!", [
                    {text: "OK", onPress: () => router.push("/ticket")}
                ]);
            }
            
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data.message);
                if (String(error.response?.data.message).includes("You can't register twice for the same event")) {
                    return Alert.alert("Inscrição", "Este e-mail já está cadastrado")
                }
                if (String(error.response?.data.message).includes("There is no room for this event")) {
                    return Alert.alert("Inscrição", "Este evento está lotado")
                }
            }
            Alert.alert("Inscrição", "Não foi possível fazer a inscrição");
        } 
        
    }
    
    return (
        <View className="flex-1 bg-green-500 items-center justify-center p-8">
            <StatusBar barStyle="light-content"></StatusBar>
            <Image 
                source={require("@/assets/logo.png")}
                className="h-16"
                resizeMode="contain"
            />
            <View className="w-full mt-12 gap-3">
                <Input>
                    <FontAwesome6 
                        name="user-circle"
                        size={20}
                        color={colors.green[200]}
                    />
                    <Input.Field placeholder="Nome completo" onChangeText={setName}></Input.Field>
                </Input>                
                <Input>
                    <MaterialIcons 
                        name="alternate-email"
                        size={20}
                        color={colors.green[200]}
                    />
                    <Input.Field placeholder="E-mail" keyboardType="email-address" onChangeText={setEmail}></Input.Field>
                </Input>
                <Button title="Realizar inscrição" onPress={handleRegister} isLoading={isLoading}/>
                <Link href="/" className="text-gray-100 text-base font-bold text-center mt-8">
                    Já possui ingresso?
                </Link>
            </View>
        </View>
    )
}