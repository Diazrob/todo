import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from './styles/master-stylesheet';
import Item from './components/item';
import { useEffect, useState } from 'react';

export default function App() {
    const [db, setDb] = useState(null);
    const [text, setText] = useState(null);
    const [updateItems, forceUpdate] = useState(0);
    const [items, setItems] = useState([]);

    // connect to the database
    useEffect(() => {
        let db = null;
        if (Platform.OS === 'web') {
            db = {
                transaction: () => {
                    return {
                        executeSql: () => { }
                    }
                }
            }
        } else {
            db = SQLite.openDatabase('todo.db');
        }
        setDb(db);

        // create the table if it doesn't exist.
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists items (id integer primary key not null, done int, value text);"
            )
        })


        return () => { db ? db.close : undefined }
    }, [])
    // when the items in the database change ..
    useEffect(() => {
        if (db) {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        "select * from items",
                        [],
                        (_, { rows }) => setItems(rows._array)
                    )
                }
            )
        }
    }, [db, updateItems]);

    const addRecord = (text) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "insert into items (done, value) values (0, ?)",
                    [text]
                )
                tx.executeSql(
                    "select * from items",
                    [],
                    (_, { rows }) => console.log(JSON.stringify(rows))
                )
            },
            () => console.log('addRecord() failed'),
            forceUpdate(f => f+1 )
        )
    }
    const readRecord = () => { }
    const updateRecord = () => { }
    const deleteRecord = () => { }

  return (
    <View style={styles.container}>
          <Text style={styles.heading}>SQLite Demo</Text>

          <View style={styles.flexRow }>
              <TextInput
                  onChangeText={(text) => setText(text)}
                  onSubmitEditing={() => {
                      addRecord(text);
                      setText(null);
                  }}
                  placeholder="What do you need to do?"
                  style={styles.input}
                  value={text }
              />

              </View>

          <ScrollView style={styles.scrollArea}>
              <Text style={styles.sectionHeading}>To Do</Text>
              {items.map(
                  ({ id, done, value }) => {
                      if (!done) return (
                          <Item key={id} itemId={id} itemText={value}/>
                          )
				  })
              }
              <Text style={styles.sectionHeading}>Done</Text>

           </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}


