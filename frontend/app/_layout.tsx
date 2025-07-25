import { Stack } from "expo-router";
import {UserProvider} from "@/contexts/userContext";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {CabinetProvider} from "@/contexts/cabinetContext";
import {BookingsProvider} from "@/contexts/bookingsContext";
import '../global.css';
import React from "react";
import {View} from "react-native";

export default function RootLayout() {
  return <UserProvider>
            <CabinetProvider>
                <GestureHandlerRootView>
                     <BottomSheetModalProvider>
                         <BookingsProvider>
                            <View className="flex-1 bg-black">
                                 <Stack
                                      screenOptions={{
                                          animation: 'fade',
                                          headerShown: false,
                                      }}

                                  />
                            </View>
                         </BookingsProvider>
                     </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </CabinetProvider>
        </UserProvider>
    ;
}
