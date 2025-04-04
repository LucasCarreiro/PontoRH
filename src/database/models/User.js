import { db } from '../db';
import { sha256 } from 'react-native-sha256';

export const insertUser = async (email, password) => {
  try {
    const passwordHash = await sha256(password);
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO users (email, password) VALUES (?, ?)',
          [email, passwordHash],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

export const validateUser = async (email, password) => {
  try {
    const passwordHash = await sha256(password);
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT password FROM users WHERE email = ?',
          [email],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0).password === passwordHash);
            } else {
              resolve(false);
            }
          },
          (_, error) => reject(error)
        );
      });
    });
  } catch (error) {
    console.error('Error validating user:', error);
    return false;
  }
};

export const isDatabaseEmpty = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users',
        [],
        (_, result) => resolve(result.rows.length === 0),
        (_, error) => reject(error)
      );
    });
  });
};
