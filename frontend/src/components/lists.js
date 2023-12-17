import './styles.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import img1 from './Images/1.png';
import img2 from './Images/2.png';
import img3 from './Images/3.png';
import img4 from './Images/4.png';
import img5 from './Images/5.png';
import img6 from './Images/6.png';
import img7 from './Images/7.png';
import img8 from './Images/8.png';
import img9 from './Images/9.jpg';
import img10 from './Images/10.jpeg';
import encabezado from './Images/encabezado.png';
import pie from './Images/pie.png';

const API = process.env.REACT_APP_API;

export const Lists = ({user}) => {

  const history = useNavigate();
  const [candidates, setCandidates] = useState([])

  const images = [img1, img2, img3, img4, img5,
    img6, img7, img8, img9, img10];

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
      axios.get(`${API}/lists`).then(response => {
          setCandidates(response.data);
      }).catch(error => {
          console.log(error);
      })
  };

  const setVote = (user_id) => {
      axios.post(`${API}/lists/${user_id}/voted`).then(response => {
          setCandidates(response.data);
      }).catch(error => {
          console.log(error);
      })
  };

  const handleVote = (list_id) => {
      axios.post(`${API}/lists/${list_id}`).then(response => {
          fetchData();
          setVote(user._id)
          history('/results', { replace: true });
      }).catch(error => {
          console.log(error);
      })
  };

  return (
    <div className='app'>
      <header className="header-container">
        <img src={encabezado} alt="Encabezado" className="header-image" />
      </header>
      <div className='d-flex justify-content-center align-items-center'>
        <p style={{ fontSize: '25px' }}>Vota por tu presidente y vicepresidente</p>
      </div>
      <div className='card-cont'>
        <div className='row'>
          {candidates.map((candidate, index) => (
            <div className='col' key={candidate._id}>
              <div className='card' style={{ width: '18rem' }}>
                <img src={images[index % images.length]} className='card-img-top' alt="..." />
                <div className='card-body d-flex justify-content-center'>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => handleVote(candidate._id)}
                    >Votar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />
      <footer className='footer-container'>
        <img src={pie} alt="Pie" className='footer-img' />
      </footer>
    </div>
  )
};