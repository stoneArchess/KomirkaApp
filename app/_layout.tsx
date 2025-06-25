import { Stack } from "expo-router";
import {UserProvider} from "@/contexts/userContext";

export default function RootLayout() {
  return <UserProvider>
          <Stack
              screenOptions={{
                  animation: 'fade',
                  headerShown: false,
              }}
          />
        </UserProvider>
    ;
}
