import { Stack } from "expo-router";
import {UserProvider} from "@/contexts/userContext";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {CabinetProvider} from "@/contexts/cabinetContext";
import {BookingsProvider} from "@/contexts/bookingsContext";
import '../global.css';
import Register from "@/app/auth/register";
import React from "react";

export default function RootLayout() {
  return <UserProvider>
            <CabinetProvider>
                <GestureHandlerRootView>
                     <BottomSheetModalProvider>
                         <BookingsProvider>

                         <Stack
                              screenOptions={{
                                  animation: 'fade',
                                  headerShown: false,
                              }}
                          />
                         </BookingsProvider>
                     </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </CabinetProvider>
        </UserProvider>
    ;
}
