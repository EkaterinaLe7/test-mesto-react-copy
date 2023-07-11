import React, { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmationDeletePopup from "./ConfirmationDeletePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { AppContext } from "../contexts/AppContext";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoadiing] = useState(false);
  const [selectedDeletCard, setSelectedDeletCard] = useState(null);

  useEffect(() => {
    api
      .getAppInfo()
      .then(([cardsArray, userData]) => {
        setCards(cardsArray);
        setCurrentUser(userData);
      })
      .catch(console.error);
  }, []);

  function handleCardLike({ likes, id }) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === id ? newCard : c)));
      })
      .catch(console.error);
  }

  function handleSubmit(request) {
    setIsLoadiing(true);
    request()
      .then(closeAllPopups)
      .catch(console.error)
      .finally(() => setIsLoadiing(false));
  }

  function handleCardDelete({ id }) {
    function makeRequest() {
      return api.deliteCard(id).then(() => {
        setCards((cards) => cards.filter((c) => c._id !== id));
      });
    }

    handleSubmit(makeRequest);
  }

  function handleUpdateUser(data) {
    function makeRequest() {
      return api.setUserInfo(data).then(setCurrentUser);
    }

    handleSubmit(makeRequest);
  }

  function handleUpdateAvatar(data) {
    function makeRequest() {
      return api.editAvatar(data).then(setCurrentUser);
    }

    handleSubmit(makeRequest);
  }

  function handleAddPlaceSubmit(data) {
    function makeRequest() {
      return api.createCard(data).then((newCard) => {
        setCards([newCard, ...cards]);
      });
    }

    handleSubmit(makeRequest);
  }

  function handleConfirmationDelete(card) {
    setSelectedDeletCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setSelectedDeletCard(null);
  }

  return (
    <AppContext.Provider value={{ isLoading, closeAllPopups }}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <div className="page__container">
            <Header />
            <Main
              cards={cards}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onConfirmationDelete={handleConfirmationDelete}
            />
            <Footer />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onUpdateUser={handleUpdateUser}
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onUpdateAvatar={handleUpdateAvatar}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onAddPlace={handleAddPlaceSubmit}
            />
            <ConfirmationDeletePopup
              card={selectedDeletCard}
              onCardDelete={handleCardDelete}
            />
            <ImagePopup selectedCard={selectedCard} />
          </div>
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
