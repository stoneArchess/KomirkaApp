import { Stack } from "expo-router";
import {UserProvider} from "@/contexts/userContext";

export default function RootLayout() {
  return <UserProvider>
          <Stack
              initialRouteName="auth/login"
              screenOptions={{
                  animation: 'fade',
                  headerShown: false,
              }}
          />
        </UserProvider>
    ;
}
