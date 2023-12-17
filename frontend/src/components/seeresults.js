import './styles.css';
import encabezado from './Images/encabezado.png';
import pie from './Images/pie.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import img2 from './Images/psc.png';
import img1 from './Images/adn.png';
import img3 from './Images/amigo.png';
import img7 from './Images/construye.png';
import img4 from './Images/avanza.png';
import img6 from './Images/rc5.png';
import img5 from './Images/yaku.png';
import img8 from './Images/reto.png';
import img9 from './Images/9.jpg';
import img10 from './Images/10.jpeg';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const API = process.env.REACT_APP_API;

export const Seeresults = ({setUser}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/lists`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const names = data.map((item) => item.name);
  const votes = data.map((item) => item.votes);
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const colors = [
    '#1F914C',
    '#FFE600',
    '#FF0000',
    '#244475',
    '#2B94DB',
    '#C75A5A',
    '#14C5CB',
    '#DC02DC',
    '#616161',
    '#A9A9A9',
  ];

  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

  const handlePrint = () => {
    window.print();
  };

  const chartData = {
    labels: names,
    datasets: [
      {
        label: 'Votos',
        backgroundColor: colors,
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: votes,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#000000',
        font: {
          weight: 'bold',
        },
        formatter: (value, context) => {
          const dataset = context.dataset;
          const totalVotes = dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value * 100) / totalVotes).toFixed(2) + '%';
          return percentage;
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const history = useNavigate();

  const returnLogin = () => {
    setUser(null)
    history('/', { replace: true });
  };

  return (
    <div>
      <header className="header-container">
        <img src={encabezado} alt="Encabezado" className="header-image" onClick={returnLogin}
             data-tooltip-id="imgtooltip" data-tooltip-content="Clic para cerrar sesión"/>
        <ReactTooltip
            id="imgtooltip"
            place="right"
            float={true}
        />
      </header>
      <div>
        <div className="d-flex justify-content-center align-items-center">
          <p style={{ fontSize: '25px', textAlign: 'center' }}>
            <strong>Resultados Actuales</strong>
          </p>
        </div>

        <div className="bg-light mx-auto px-2 border border-2 border-primary" style={{ width: '1200px', height: '680px', }}>
      <div className="image-row">
        {images.map((image, index) => (
          <img src={image} alt="..." className="image-item" key={index} />
        ))}
      </div>
      <div className="chart-wrapper">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
        <p style={{ textAlign: 'center', fontSize: '25px' }}>
          <strong>Total de votos:</strong> {totalVotes}
        </p>
        <div className="d-flex justify-content-center align-items-center">
          <button className="btn btn-success print-button" onClick={handlePrint}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer-fill print-icon" viewBox="0 0 16 16">
              <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
              <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
            </svg>
            Imprimir
          </button>
        </div>
      </div>
      <br />
      <footer className="footer-container">
        <img src={pie} alt="Pie" className="footer-img" />
      </footer>
    </div>
  );
};
