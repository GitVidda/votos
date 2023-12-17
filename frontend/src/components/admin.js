import './styles.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import encabezado from './Images/encabezado.png'
import { AdminA } from "./adminA";
import { AdminU } from './adminU';
import { AdminL } from './adminL';

export const Admin = ({setUser}) => {

    const [activeSection, setActiveSection] = useState('');
    const [sectionContent, setSectionContent] = useState(null);

    const history = useNavigate();

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    useEffect(() => {
        if (activeSection === ''){

        } else if (activeSection === 'users') {
            setSectionContent(
                <AdminU />
            );
        } else if (activeSection === 'lists') {
            setSectionContent(
                <AdminL />
            );
        } else if (activeSection === 'audit') {
            setSectionContent(
                <AdminA />
            );
        }
    }, [activeSection]);

    const location = useLocation();
    const { user } = location.state || {};

    const returnLogin = () => {
        setUser(null)
        history('/');
    };

    return (
       <div>
        <header className="header-container">
        <img src={encabezado} alt="Encabezado" className="header-image" onClick={returnLogin}
             data-tooltip-id="imgtooltip" data-tooltip-content="Clic para cerrar sesión"/>
            <Tooltip
                id="imgtooltip"
                place="right"
                float={true}
            />
      </header>
      <div className='d-flex justify-content-center align-items-center'>
        <p style={{ fontSize: '30px', textAlign: 'center' }}>
          <strong>Bienvenido { user } </strong>
        </p>
      </div>
           <div className="contenedor-btn" style={{marginBottom: '5px'}}>
               <button onClick={() => handleSectionChange('users')} className="custom-btn btn btn-primary" style={{ display: 'inline-block', marginRight: '5px' }}>
                   Administrar Usuarios
               </button>
               <button onClick={() => handleSectionChange('lists')} className="custom-btn btn btn-primary" style={{ display: 'inline-block', marginRight: '5px' }}>
                   Administrar Listas
               </button>
               <button onClick={() => handleSectionChange('audit')} className="custom-btn btn btn-primary" style={{ display: 'inline-block' }}>
                   Auditoría
               </button>
           </div>
           {sectionContent}
       </div>
    )
};
