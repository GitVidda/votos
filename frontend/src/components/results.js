import './styles.css';
import { useNavigate } from 'react-router-dom';
import encabezado from './Images/encabezado.png';
import pie from './Images/pie.png';

export const Results = () => {

  const history = useNavigate();

  const handleClick = () => {
    history('/seeresults', { replace: true });
  };

  return (
    <div>
      <header className="header-container">
        <img src={encabezado} alt="Encabezado" className="header-image" />
      </header>
      <div className='d-flex justify-content-center align-items-center'>
        <p style={{ fontSize: '30px', textAlign: 'center' }}>
          <strong>¡Felicidades!<br />Su voto se ha registrado con éxito</strong>
        </p>
      </div>
      <main className="content">
          <button className="btn btn-primary custom-btn" onClick={handleClick}>
            Ver<br />Resultado
          </button>
      </main>
      <footer className='footer-container'>
        <img src={pie} alt="Pie" className='footer-image' />
      </footer>
    </div>
  )
};