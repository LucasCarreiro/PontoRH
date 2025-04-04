import { db } from '../db';

export const saveData = (time, email) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO pontos (ponto, email_ID) VALUES (?, ?)',
        [time, email],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const getPoints = async (email) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pontos WHERE email_ID = ?',
        [email],
        (_, result) => {
          const points = [];
          for (let i = 0; i < result.rows.length; i++) {
            points.push(result.rows.item(i));
          }
          resolve(points);
        },
        (_, error) => reject(error)
      );
    });
  });
};
