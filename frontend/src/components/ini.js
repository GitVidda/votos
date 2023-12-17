import './styles.css';
import {useLocation, useNavigate} from 'react-router-dom';

import encabezado from './Images/encabezado.png'
import pie from './Images/pie.png'

export const Ini = () => {

  const history = useNavigate();
    const location = useLocation();
    const { user } = location.state || {};

  const handleClick = () => {
    history('/lists', { replace: true });
  };

  return (
    <div >

      <header className="header-container">
        <img src={encabezado} alt="Encabezado" className="header-image" />
      </header>
      <div className='d-flex justify-content-center align-items-center'>
        <p style={{ fontSize: '30px', textAlign: 'center' }}>
          <strong>Bienvenido { user } al sistema de voto electrónico para<br />las elecciones presidenciales, legislativas anticipadas 2023</strong>
        </p>
      </div>
      <main className="content">
          <button className="custom-btn btn btn-primary" onClick={handleClick}>
            Ingresa para <br />votar
          </button>
      </main>
      <footer className='footer-container'>
        <img src={pie} alt="Pie" className='footer-image' />
      </footer>
    </div>
  )
};
