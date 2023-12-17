import './styles.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import encabezado from './Images/encabezado.png'
import pie from './Images/pie.png'
import img from './Images/cne-ecuador.jpg';

const API = process.env.REACT_APP_API;

export const Login = ({setUser}) => {

  const [_id, set_ID] = useState('');
  const [ci, setCI] = useState('');
  const [error, setError] = useState(false);

  const history = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if ([_id, ci].includes('') || _id.length !== 24 || !/^\d{10}$/.test(ci) || /\s/.test(_id) || /\s/.test(ci)) {
      setError(true);
      return
    }
      handleLogin();
      setError(false);

  };

  const audit = () => {
    axios.post(`${API}/audit`, {user: ci}).then(response => {
    }).catch(error => {
      console.log(error);
    })
  }

  const handleLogin = () => {
    let person = {
      ci: ci,
      _id: _id,
    };
    console.info(person);
    axios.post(`${API}/login`, person).then(response => {
      if (response.data.exists && !response.data.voted && response.data.permission === "voter") {
        setUser({
          _id: _id,
          ci: ci,
          user: response.data.user,
          voted: response.data.voted,
          permission: response.data.permission
        })
        history('/ini', { replace: true, state: { user: response.data.user } });
        audit()
      } else if (response.data.exists && response.data.voted && response.data.permission === "voter") {
        alert("Usted ya tiene registrado un voto.");
      } else if (!response.data.exists) {
        setError(true);
      } else if (response.data.exists && response.data.permission === "admin") {
        setUser({
          _id: _id,
          ci: ci,
          user: response.data.user,
          permission: response.data.permission
        })
        history('/admin', { state: { user: response.data.user } });
      }}).catch(error => {
      console.log(error);
    })
  }

  return (
    <div >
      <header className="header-container">
        <img src={encabezado} alt="Encabezado" className="header-image" />
      </header>
      <section className="section-login">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
            <img src={img} className="img-cne" alt="CNE"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form>
                <div className="form-outline mb-4">
                {error && <p style={{ color: 'red' }}>Datos ingresados erroneos</p>}
                  <input
                    type="text"
                    id="ci"
                    className="form-control form-control-lg"
                    placeholder="Ingrese su cédula"
                    value={ci}
                    onChange={(e) => setCI(e.target.value)}
                  />
                  <label className="form-label" htmlFor="form3Example3">
                    CI
                  </label>
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="code"
                    className="form-control form-control-lg"
                    placeholder="Ingrese su código"
                    value={_id}
                    onChange={(e) => set_ID(e.target.value)}
                  />
                  <label className="form-label" htmlFor="form3Example3">
                    Código Secreto
                  </label>
                </div>
                <div className="text-center text-lg-start mt-4 pt-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                      onClick={handleSubmit}
                      >
                      Entrar
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer className='footer-container'>
        <img src={pie} alt="Pie" className='footer-image' />
      </footer>
    </div>
  )
};
