import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from './firebaseConfig';
import LineChartComponent from './LineChartComponent'; 

function getDateFromTimestamp(timestampSeconds) {
  const date = new Date(timestampSeconds * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const groupDataByWeek = (data) => {
  const weeks = [];
  let currentWeek = [];
  let currentWeekNumber = null;

  data.forEach(entry => {
    const date = new Date(entry.date);
    const weekNumber = Math.ceil((date.getDate() - 1) / 7);

    if (currentWeekNumber === null) {
      currentWeekNumber = weekNumber;
    }

    if (weekNumber !== currentWeekNumber) {
      weeks.push(currentWeek);
      currentWeek = [];
      currentWeekNumber = weekNumber;
    }

    currentWeek.push(entry);
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

const App = () => {
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'LogBook'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
    };
    fetchData();
  }, []);

  useEffect(() => {
    data.sort((a, b) => {
      const dateA = a.timestamp ? a.timestamp.seconds : 0;
      const dateB = b.timestamp ? b.timestamp.seconds : 0;
      return dateA - dateB;
    });

    const contactCountsPerDay = new Map();

    data.forEach(entry => {
      if (entry.contactCount !== undefined && entry.timestamp && entry.timestamp.seconds) {
        const date = getDateFromTimestamp(entry.timestamp.seconds);
        const count = contactCountsPerDay.get(date) || 0;
        contactCountsPerDay.set(date, count + entry.contactCount);
      }
    });

    const result = Array.from(contactCountsPerDay, ([date, count]) => ({ date, count }));
    console.log("result: ", result);
    setResult(result);

    const weeks = groupDataByWeek(result);
    setWeekData(weeks);
  }, [data]);

  return (
    <div>
      {result?.length> 0 && <LineChartComponent data={result} weekData={weekData} currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />} {/* Include the new component */}
    </div>
  );
};

export default App;
