import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LineChartComponent = ({ data, weekData, currentWeek, setCurrentWeek }) => {
  const handlePrevWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < weekData.length - 1) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const currentWeekData = weekData[currentWeek];
  const currentMonth = currentWeekData.length > 0 ? new Date(currentWeekData[0].date).toLocaleString('default', { month: 'long' }) : '';

  const allCounts = currentWeekData.map(entry => entry.count);
  const minCount = Math.min(...allCounts);
  const maxCount = Math.max(...allCounts);
  const ticks = Array.from({ length: maxCount - minCount + 1 }, (_, i) => minCount + i);

  return (
    <div style={{ textAlign: 'center', margin: '20px', width:"107%" }}>

      <div style={{"display": 'flex', justifyContent:"center", alignItems:"center", gap:"200px"}}>
      <h2 style={{color: "white", font:"play"}}>Number Of Contacts Per Day</h2>
      <div style={{ marginTop: '10px', color:"white" }}>
        <span>{currentMonth}</span>
      </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', color:"#17F9DA" }}>
        <div onClick={handlePrevWeek} disabled={currentWeek === 0} style={{cursor:"pointer", fontWeight:800}}>{"<"}</div>
        <span style={{ margin: '0 10px' }}>Week {currentWeek + 1}</span>
        <div onClick={handleNextWeek} disabled={currentWeek === weekData.length - 1} style={{cursor:"pointer", fontWeight:800}}>{">"}</div>
      </div>

    

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ResponsiveContainer width="90%" height={500}>
          <LineChart
            data={currentWeekData}
            margin={{
              top: 20, right: 30, left: 20, bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" interval={0} tick={{ angle: -45, textAnchor: 'end' }} />
            <YAxis ticks={ticks} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#17F9DA" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    
    </div>
  );
};

export default LineChartComponent;
