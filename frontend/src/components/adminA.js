import './styles.css';
import {useEffect, useState} from "react";
import axios from 'axios';

const API = process.env.REACT_APP_API;

export const AdminA = () => {
    const [search, setSearch] = useState('');
    const [audits, setAudits] = useState([]);

    useEffect(() => {
        handleRead();
    }, [])

    const handleRead = () => {
        axios.get(`${API}/audits`).then(response => {
            setAudits(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div>
            <div className='d-flex justify-content-center align-items-center'>
                <p style={{ fontSize: '30px', textAlign: 'center' }}>
                    <strong>Auditoria</strong>
                </p>
            </div>
            <div className='d-flex justify-content-center' style={{marginBottom: '188px'}}>
                    <div className='col-md-8'>
                        <div className="input-group mb-3">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Ingrese el dato del usuario a buscar"
                                   aria-label=""
                                   aria-describedby="basic-addon1"
                                   onChange={(e) => setSearch(e.target.value)}/>
                        </div>
                        <table className='table table-striped table-hover'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Hora y fecha de Inicio de Sesión</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audits.filter((item)=>{
                                    return search.toLowerCase() === ''
                                        ? item : item.user.toLowerCase().includes(search)
                                }).map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.user}</td>
                                        <td>{item.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    )
};
