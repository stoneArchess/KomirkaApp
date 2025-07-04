import { Stack } from "expo-router";
import {UserProvider} from "@/contexts/userContext";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {CabinetProvider} from "@/contexts/cabinetContext";

export default function RootLayout() {
  return <UserProvider>
            <CabinetProvider>
                <GestureHandlerRootView>
                     <BottomSheetModalProvider>
                         <Stack
                              screenOptions={{
                                  animation: 'fade',
                                  headerShown: false,
                              }}
                          />
                     </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </CabinetProvider>
        </UserProvider>
    ;
}
