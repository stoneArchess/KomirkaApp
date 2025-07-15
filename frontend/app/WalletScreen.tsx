import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { useNavigation } from '@react-navigation/native';

type Card = {
  id: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
};

const WalletScreen = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      last4: '4242',
      brand: 'visa',
      expMonth: 12,
      expYear: 25,
    },
  ]);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [cardData, setCardData] = useState<any>(null);

  const handleAddCard = () => {
    if (!cardData || !cardData.valid) {
      Alert.alert('Помилка', 'Будь ласка, введіть коректні дані картки');
      return;
    }

    const newCard: Card = {
      id: Math.random().toString(36).substring(7),
      last4: cardData.values.number.substr(cardData.values.number.length - 4),
      brand: cardData.values.type || 'unknown',
      expMonth: parseInt(cardData.values.expiry.split('/')[0]),
      expYear: parseInt(cardData.values.expiry.split('/')[1]),
    };

    setCards([...cards, newCard]);
    setCardData(null);
    setShowAddCardForm(false);
    Alert.alert('Успішно', 'Картка додана до вашого гаманця');
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Видалити картку',
      'Ви впевнені, що хочете видалити цю картку?',
      [
        {
          text: 'Скасувати',
          style: 'cancel',
        },
        {
          text: 'Видалити',
          onPress: () => {
            setCards(cards.filter(card => card.id !== cardId));
            Alert.alert('Картку видалено');
          },
          style: 'destructive',
        },
      ],
    );
  };

  const getCardLogo = (brand: string) => {
    const logos: Record<string, any> = {
      visa: require('../assets/images/react-logo.png'),
      mastercard: require('../assets/images/react-logo.png'),
      amex: require('../assets/images/react-logo.png'),
      discover: require('../assets/images/react-logo.png'),
    };
    return logos[brand.toLowerCase()] || require('../assets/images/react-logo.png');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мій гаманець</Text>

      {cards.length > 0 ? (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <Image source={getCardLogo(item.brand)} style={styles.cardLogo} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardText}>•••• •••• •••• {item.last4}</Text>
                <Text style={styles.cardText}>
                  Термін дії: {item.expMonth.toString().padStart(2, '0')}/{item.expYear}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCard(item.id)}
              >
                <Text style={styles.deleteButtonText}>Видалити</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>У вас ще немає доданих карток</Text>
      )}

      {showAddCardForm ? (
        <View style={styles.addCardForm}>
          <CreditCardInput
            onChange={setCardData}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowAddCardForm(false)}
            >
              <Text style={styles.buttonText}>Скасувати</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddCard}
            >
              <Text style={styles.buttonText}>Додати картку</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButtonMain}
          onPress={() => setShowAddCardForm(true)}
        >
          <Text style={styles.addButtonText}>+ Додати картку</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLogo: {
    width: 40,
    height: 25,
    marginRight: 15,
    resizeMode: 'contain',
  },
  cardInfo: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  addCardForm: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  addButtonMain: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WalletScreen;