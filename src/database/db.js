import SQLite from 'react-native-sqlite-storage';

const DB_NAME = 'dbponto.db';

const db = SQLite.openDatabase(
  { name: DB_NAME, location: 'default' },
  () => {},
  error => console.error('Error opening database', error)
);

const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )`,
      [],
      () => console.log('Users table created'),
      (_, error) => console.log('Error creating users table', error)
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS pontos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ponto TEXT NOT NULL,
        email_ID TEXT,
        FOREIGN KEY (email_ID) REFERENCES users(email)
      )`,
      [],
      () => console.log('Pontos table created'),
      (_, error) => console.log('Error creating pontos table', error)
    );
  });
};

const DatabaseProvider = ({ children }) => {
  React.useEffect(() => {
    createTables();
  }, []);

  return children;
};

export { db, DatabaseProvider };
