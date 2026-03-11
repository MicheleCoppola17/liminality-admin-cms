import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sign up: create Firebase Auth account + Firestore profile
  async function signup(email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', credential.user.uid), {
      email,
      isApproved: false,
      createdAt: serverTimestamp(),
    });
    return credential;
  }

  // Login: Firebase Auth only — approval is checked via onAuthStateChanged
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Listen to auth state changes and load the Firestore approval status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          setIsApproved(snap.exists() ? snap.data().isApproved === true : false);
        } catch {
          setIsApproved(false);
        }
      } else {
        setIsApproved(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, isApproved, loading, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
