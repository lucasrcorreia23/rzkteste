// @ts-nocheck
"use client";
import { Chart } from 'chart.js';
import ptBR from 'date-fns/locale';

import "chart.js/auto";
import { Line } from "react-chartjs-2";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chartjs-adapter-moment';
import "../../app/globals.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
// Interface para descrever o formato dos dados
interface ChartDataEntry {
  date: string;
  close: number;
}

const Cotacao = () => {
    const [currency, setCurrency] = useState('USD-BRL');
    
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [chartData, setChartData] = useState<ChartDataEntry[]>([]);
  

    
    const [currentBid, setCurrentBid] = useState<number | null>(null);
    const fetchData = useCallback(async () => {
      // Formate as datas para o formato YYYYMMDD
      const formatToApiDate = (date) => date ? `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}` : null;
    
      const formattedStartDate = formatToApiDate(startDate);
      const formattedEndDate = formatToApiDate(endDate);
    
      // Construa a URL com as datas formatadas
      let apiUrl = `https://economia.awesomeapi.com.br/json/daily/${currency}`;
      if (formattedStartDate && formattedEndDate) {
        apiUrl += `/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      }
    
      try {
        const response = await axios.get(apiUrl);
        console.log("Dados da API:", response.data); // Adicione isso para verificar os dados da API
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, [currency, startDate, endDate]);
    
    useEffect(() => {
      fetchData();
    }, [fetchData]);
    
    // Verifique se a formatação dos dados está correta
    const allChartData = chartData.map(entry => ({
      x: new Date(entry.create_date), // Certifique-se de que isso está convertendo corretamente
      y: parseFloat(entry.bid) // Certifique-se de que o bid é um número
    }));
    
    const chartDataFormatted = {
      labels: allChartData.map(entry => entry.x.toLocaleDateString('pt-BR')), // Formate as datas para exibição
      
  datasets: [
    {
      label: 'Cotação Histórica',
      data: allChartData,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      pointRadius: 5,
      pointHoverRadius: 7,
    }
  ],
};

// Opções do gráfico
const chartOptions = {
  responsive: true,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        tooltipFormat: 'DD/MM/YYYY', // Formato da tooltip
        displayFormats: {
          day: 'DD/MM/YYYY' // Formato das labels no eixo X
        }
      },
      title: {
        display: true,
        text: 'Data'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Cotação'
      }
    }
  },
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  }
};

  
    return (
      <main className="container">
      <section >
         <h1 className="text-brandgreen text-center text-4xl py-10 border px-40 mb-10 bg-slate-50 rounded-lg font-bold shadow-sm">
          Gráfico de Cotação de Moedas Estrangeiras
        </h1>
      </section>
      <section className="flex relative flex-col lg:flex-row  ">
        <ul className="h-max bg-slate-50 rounded-lg text-brandgreen p-4 mr-6 flex shadow-sm text-center lg:text-left flex-row lg:flex-col">
          <li className="pb-3 flex-col flex flex-start" >
            <label className=" font-bold">Selecione a Moeda:</label>
            <select className="w-max mx-auto md:m-0" onChange={e => setCurrency(e.target.value)}>
              <option value="USD-BRL">Dólar</option>
              <option value="EUR-BRL">Euro</option>
              <option value="BTC-BRL">Bitcoin</option>
            </select>
          </li>
          <li className="pb-3" >
            <label className="py-4 w-full lg:w-auto font-bold ">Data Inicial:</label>
            <DatePicker className="w-max mx-auto" selected={startDate} onChange={date => setStartDate(date)} />
          </li>
          <li className="pb-3" >
            <label className="py-4 font-bold">Data Final:</label>
            <DatePicker className="w-max mx-auto" selected={endDate} onChange={date => setEndDate(date)} />
          </li>
          </ul>
          <div className="w-full h-96" >
          <Line data={chartDataFormatted} options={chartOptions} />
          </div>
        
      </section>
      </main>
    );
  };
  
  
  
  export default Cotacao;