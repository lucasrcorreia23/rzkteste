// @ts-nocheck
"use client";
import { Chart } from "chart.js";
import ptBR from "date-fns/locale";

import "chart.js/auto";
import { Line } from "react-chartjs-2";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "chartjs-adapter-moment";
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
} from "chart.js";

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
  const [currency, setCurrency] = useState("USD-BRL");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);

  const hoje = new Date();

  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const fetchData = useCallback(async () => {
    const formatToApiDate = (date) =>
      date
        ? `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}${String(date.getDate()).padStart(2, "0")}`
        : null;

    const apiUrl = (date) =>
      `https://economia.awesomeapi.com.br/json/daily/${currency}/?start_date=${formatToApiDate(
        date
      )}&end_date=${formatToApiDate(date)}`;
    
    try {
      // Faz chamadas separadas para cada data
      const responses = await Promise.all([
        startDate ? axios.get(apiUrl(startDate)) : null,
        endDate ? axios.get(apiUrl(endDate)) : null,
      ]);

      // Combina os resultados das duas chamadas
      const combinedData = responses.reduce((acc, response) => {
        if (response && response.data) {
          acc.push(...response.data);
        }
        return acc;
      }, []);

      console.log("Dados Combinados:", combinedData);
      setChartData(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [currency, startDate, endDate,]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allChartData = chartData
    .map((entry) => {
      const date = new Date(entry.create_date);
      const bidValue = parseFloat(entry.bid);

      if (!isNaN(date.getTime()) && !isNaN(bidValue)) {
        return {
          x: date,
          y: bidValue,
        };
      } else {
       
        console.error("Data inválida ou valor da cotação inválido:", entry);
        return null; 
      }
    })
    .filter((entry) => entry !== null); // Filtra quaisquer entradas que foram mapeadas para null

  console.log("Dados formatados para o gráfico (allChartData):", allChartData);
  const cincoDiasPassados = new Date(
    hoje.getTime() - 400 * 24 * 60 * 60 * 1000
  );
  const cincoDiasFuturos = new Date(hoje.getTime() + 10 * 24 * 60 * 60 * 1000);
  const chartDataFormatted = {
    labels: allChartData.map((entry) => entry.x.toLocaleDateString("pt-BR")), // Formate as datas para exibição

    datasets: [
      {
        label: "Cotação Histórica",
        data: allChartData,
        borderRadius:6,
        borderWidth:2,
        borderColor: "#61ce70",
        backgroundColor: "#f9f9f9",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          
          callback: function (val, index) {
          
            return index % 4 === 0 ? this.getLabelForValue(val) : "";
          },
        },
        tension: 0.4,
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "DD/MM/YYYY", 
          displayFormats: {
            day: "DD/MM/YYYY", 
          },
        },

        min: cincoDiasPassados, 
        max: cincoDiasFuturos,
      },
      y: {
        title: {
          display: true,
          text: "Cotação",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
   <div className="container">
      <section>
        <h1 className="text-brandgreen text-center text-xl lg:text-4xl lg:py-10 py-5 border px-10 lg:px-40 mb-10 bg-slate-50 rounded-lg font-medium shadow-sm">
          Gráfico de Cotação de Moedas Estrangeiras
        </h1>
      </section>
      <section className="flex relative flex-col w-full mx-auto lg:justify-center lg:flex-row ">
        <ul className="h-max lg:items-start items-center justify-center bg-slate-50 rounded-lg text-brandgreen p-4 mr-6 flex shadow-sm text-center w-full lg:w-auto lg:text-left flex-col md:flex-row lg:flex-col">
          <li className="pb-3 flex-col flex flex-start">
            <label className=" font-bold">Moeda</label>
            <select
              className="w-max mx-auto md:m-0"
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD-BRL">Dólar</option>
              <option value="EUR-BRL">Euro</option>
              <option value="BTC-BRL">Bitcoin</option>
            </select>
          </li>
          <li className="pb-3  flex-col flex flex-start">
            <label className=" w-full lg:w-auto font-bold ">
              Data Inicial:
            </label>
            <DatePicker
              className="w-max mx-auto"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </li>
          <li className="pb-3 flex-col flex flex-start">
            <label className=" font-bold">Data Final:</label>
            <DatePicker
              className="w-max mx-auto"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </li>
        </ul>
        <div className="lg:w-full lg:py-0 py-10">
          <Line className="lg:w-full" data={chartDataFormatted} options={chartOptions} />
        </div>
      </section>
      </div>
  );
};

export default Cotacao;
