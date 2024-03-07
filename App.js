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
            db = SQLite.openDatabase('todo1.db');
        }
        setDb(db);

        // create the table if it doesn't exist.
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists items (id integer primary key not null, done int, value text);"
            ),
                (_, error) => console.log(error),
                () => console.log("Table exists or was created")
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
                        (_, { rows }) => setItems(rows._array),
                        (_,error) => console.log(error)
                    ),
                        (_, error) => console.log(error),
                        () => console.log("items was reloaded")
                }
            )
        }
    }, [db, updateItems]);

    const addRecord = (text) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "insert into items (done, value) values (0, ?)",
                    [text],
                    () => console.log("added ", text), // if it work
                    (_,error) => console.log(error)     // if it doesn't work
                )
            },
            (_,error) => console.log('addRecord() failed', error),
            forceUpdate(f => f+1 )
        )
    }
    const readRecord = () => { }
    const updateRecord = (id, done) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "update items set done = ? where id = ?",
                    [done,id],
                    () => console.log("updated record ", id), // if it work
                    (_, error) => console.log(error)     // if it doesn't work
                )
            },
            (_, error) => console.log('updateRecord() failed', error),
            forceUpdate(f => f + 1)
        )
    }
    const deleteRecord = (id) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "delete from items where id = ?",
                    [id],
                    () => console.log("deleted record ", id), // if it work
                    (_, error) => console.log(error)     // if it doesn't work
                )
            },
            (_, error) => console.log('deleteRecord() failed', error),
            forceUpdate(f => f + 1)
        )
    }

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
              <Text style={styles.sectionHeading}>To Do's</Text>
              {items.map(
                  ({ id, done, value }) => {
                      if (!done) return (
                          <Item
                              key={id}
                              itemId={id}
                              itemText={value}
                              onPress={() => { updateRecord(id, 1) }}
                              onLongPress={() => { deleteRecord(id) }}
                          />
                          )
				  })
              }
              <Text style={styles.sectionHeading}>Done</Text>
              {items.map(
                  ({ id, done, value }) => {
                      if (done) return (
                          <Item
                              key={id}
                              itemId={id}
                              itemText={value}
                              onPress={() => { updateRecord(id, 0) }}
                              onLongPress={() => { deleteRecord(id) }}
                          />
                      )
                  })
              }
          </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}


