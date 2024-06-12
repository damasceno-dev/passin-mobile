import {Alert, Image, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {Input} from "@/components/input";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "@/styles/colors";
import {Button} from "@/components/button";
import {Link, Redirect} from "expo-router";
import {useState} from "react";
import {api} from "@/server/api";
import {BadgeStore, useBadgeStore} from "@/store/badge-store";
const EVENT_ID = "9E9BD979-9D10-4915-B339-3786B1634F33";

export default function Home() {
    
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const badgeStore = useBadgeStore();
    async function handleAccessCredentials() {
        if (!code.trim()) {
            return Alert.alert("Ingresso", "Informe o código do ingresso!")
        }

        setIsLoading(true)

        try {
            const {data} = await api.get(`/api/attendees/${EVENT_ID}?query=${code}`);
            console.log(data.attendees)
            if (!data.attendees[0]) {
                Alert.alert("Ingresso", "Ingresso não encontrado");
            }
            badgeStore.save(data.attendees[0])

        } catch (error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert("Ingresso", "Ingresso não encontrado");
        }

    }
    if (badgeStore.data?.id) {
        return <Redirect href="/ticket" />
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
                    <MaterialCommunityIcons 
                        name="ticket-confirmation-outline"
                        size={20}
                        color={colors.green[200]}
                    />
                    <Input.Field
                        placeholder="Código do ingresso"
                        onChangeText={setCode}
                    />
                </Input>
                <Button title="Acessar credencial" onPress={handleAccessCredentials} isLoading={isLoading}/>
                <Link href="/register" className="text-gray-100 text-base font-bold text-center mt-8">
                    Ainda não possui ingresso?
                </Link>
            </View>
        </View>
    )
}