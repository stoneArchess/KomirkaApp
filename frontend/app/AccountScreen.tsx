import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: 'Іван Петренко',
    phone: '+380 99 123 4567',
    email: 'ivan.petrenko@example.com',
    password: '11111111',
    avatar: '../assets/images/sadtestpfp.png',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri });
    }
  };

  const confirmDeleteAvatar = () => {
    setShowDeleteModal(true);
  };

  const deleteAvatar = () => {
    setUser({ ...user, avatar: '' });
    setShowDeleteModal(false);
  };

  const saveChanges = () => {
    Alert.alert('Зміни збережено');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <Image
          source={user.avatar ? { uri: user.avatar } : require('../assets/images/react-logo.png')}
          style={styles.avatar}
        />
        <View style={styles.avatarButtons}>
          <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
            <Text style={styles.avatarButtonText}>Змінити</Text>
          </TouchableOpacity>
          {user.avatar && (
            <TouchableOpacity 
              style={[styles.avatarButton, styles.deleteButton]} 
              onPress={confirmDeleteAvatar}
            >
              <Text style={styles.avatarButtonText}>Видалити</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Ім&apos;я</Text>
        <TextInput
          style={styles.input}
          value={user.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text style={styles.label}>Номер телефону</Text>
        <TextInput
          style={styles.input}
          value={user.phone}
          onChangeText={(text) => handleChange('phone', text)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Пароль</Text>
        <TextInput
          style={styles.input}
          value={user.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>Зберегти зміни</Text>
      </TouchableOpacity>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Видалити аватар?</Text>
            <Text style={styles.modalText}>Ви впевнені, що хочете видалити свою аватарку?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={deleteAvatar}
              >
                <Text style={styles.modalButtonText}>Видалити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3498db',
    marginBottom: 15,
  },
  avatarButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatarButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  avatarButtonText: {
    color: 'white',
    fontSize: 14,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    color: 'white',
  },
});

export default AccountScreen;