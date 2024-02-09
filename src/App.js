import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import Papa from 'papaparse';
import styled from 'styled-components';

const Container = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
`;

const StyledCanvas = styled.canvas`
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const DynamicPlot = () => {
  const [data, setData] = useState({ xValues: [], yValues: [] });
  const [newX, setNewX] = useState('');
  const [newY, setNewY] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const chartRef = useRef();

  useEffect(() => {
    if (csvFile) {
      parseCSVFile(csvFile);
    }
  }, [csvFile]);

  useEffect(() => {
    drawChart();
  }, [data]);

  const parseCSVFile = (file) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const xValues = result.data.map((entry) => entry.x);
        const yValues = result.data.map((entry) => entry.y);
        setData({ xValues, yValues });

        console.log('Parsed CSV Values:', result.data);
      },
    });
  };

  const drawChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.xValues.map((_, index) => `Point ${index + 1}`),
        datasets: [{
          label: 'Line Plot',
          data: data.yValues,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        }],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 5,
            },
          },
          y: {
            ticks: {
              maxTicksLimit: 5,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  };

  const handleAddDataPoint = () => {
    const newXValues = [...data.xValues, parseFloat(newX)];
    const newYValues = [...data.yValues, parseFloat(newY)];
    setData({ xValues: newXValues, yValues: newYValues });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

  return (
    <Container>
      <Title>Line Plot:</Title>
      <InputContainer>
        <label>X Value:</label>
        <Input type="number" value={newX} onChange={(e) => setNewX(e.target.value)} />
      </InputContainer>
      <InputContainer>
        <label>Y Value:</label>
        <Input type="number" value={newY} onChange={(e) => setNewY(e.target.value)} />
      </InputContainer>
      <StyledButton onClick={handleAddDataPoint}>Add Data Point</StyledButton>
      <InputContainer>
        <label>Upload CSV File:</label>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </InputContainer>
      <InputContainer>
        <h3>Data Values:</h3>
        <List>
          {data.xValues.map((x, index) => (
            <ListItem key={index}>X: {x}, Y: {data.yValues[index]}</ListItem>
          ))}
        </List>
      </InputContainer>
      <StyledCanvas id="myChart" width="500" height="500"></StyledCanvas>
    </Container>
  );
};

export default DynamicPlot;
