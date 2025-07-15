import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
  //тимчасово
  const user = {
    name: 'Іван Петренко',
    phone: '+380 99 123 4567',
    avatar: '../assets/images/sadtestpfp.png',
  };

  const profileButtons = [
    { id: 1, title: 'Мій аккаунт' },
    { id: 2, title: 'Історія' },
    { id: 3, title: 'Гаманець', screen: 'Wallet' },
    { id: 4, title: 'Налаштування' },
    { id: 5, title: 'Вийти з облікового запису', color: '#FF3B30' },
    { id: 6, title: 'Видалити обліковий запис', color: '#FF3B30' },
  ];

  const handleButtonPress = (buttonId: number) => {
    console.log(`Натиснута кнопка з id: ${buttonId}`);
    
  };

  return (
    <View style={styles.container}>
      {/*Аватарка*/}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          onError={() => console.log("Помилка завантаження аватарки")}
        />
      </View>
      
      {/*Ім'я та телефон*/}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.phone}>{user.phone}</Text>
      
      {/*Кнопки профілю*/}
      <View style={styles.buttonsContainer}>
        {profileButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[styles.button, button.color ? { borderColor: button.color } : null]}
            onPress={() => handleButtonPress(button.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, button.color ? { color: button.color } : null]}>
              {button.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#3498db',
  },
});

export default ProfileScreen;