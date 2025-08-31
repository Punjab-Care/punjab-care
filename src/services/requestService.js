// src/services/requestService.js
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const submitRequest = async (requestData) => {
  const ownerId = localStorage.getItem('ownerId');
  await addDoc(collection(db, 'requests'), {
    requestData,
    ownerId,
    createdAt: new Date(),
  });
};
