/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView, Text, View} from 'react-native';
import axios from 'axios';

function swap(items, i, j) {
  const tmp = items[i];
  items[i] = items[j];
  items[j] = tmp;
}

function partition(items, left, right) {
  let pivot = items[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;
  while (i <= j) {
    while (items[i].total > pivot.total) i++;
    while (items[j].total < pivot.total) j--;
    if (i <= j) {
      swap(items, i, j);
      i++;
      j--;
    }
  }
  return i;
}

function quickSort(items, left, right) {
  let index;
  if (items.length > 1) {
    index = partition(items, left, right);
    if (left < index - 1) quickSort(items, left, index - 1);
    if (index < right) quickSort(items, index, right);
  }
}

const fetchAthelete = async atheleteId => {
  const str = `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${atheleteId}`;
  console.log(str);
  const response = await axios.get(str);
  return response?.data?.athlete?.college ?? null;
};

const fetchAllAtheletes = async () => {
  let i = 1;
  const colleges = {};
  while (true) {
    const c = await fetchAthelete(i);
    console.log(c);
    if (!c) {
      break;
    } else {
      const obj = colleges[c.id];
      if (!obj) {
        colleges[c.id] = {
          ...c,
          total: 1,
        };
      } else {
        obj.total++;
      }
    }
    i++;
  }
  return colleges;
};

const App = () => {
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const colleges = await fetchAllAtheletes();
      const arr = Object.values(colleges);
      quickSort(arr, 0, arr.length - 1);
      setResult(arr.slice(0, 5));
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        result.map(i => {
          return (
            <View key={i.id} style={{flexDirection: 'row'}}>
              <Text>{i.name}</Text>
              <Text>{i.total}</Text>
            </View>
          );
        })
      )}
    </SafeAreaView>
  );
};

export default App;
