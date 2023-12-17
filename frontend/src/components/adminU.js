import './styles.css';
import {useEffect, useState} from "react";
import axios from 'axios';

const API = process.env.REACT_APP_API;
export const AdminU = () => {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [CI, setCI] = useState('');
    const [name, setName] = useState('');
    const [voted, setVoted] = useState('');
    const [permission, setPermission] = useState('');

    const [error, setError] = useState(false);
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        handleRead();
    }, [])

    const openModal = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
            setCI('')
            setName('')
            setVoted('')
            setPermission('')
            setId('')

            setError(false);

            setModalVisible(false);
    }

    const handleRead = () => {
        axios.get(`${API}/users`).then(response => {
            setUsers(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (/^\s*$/.test(CI) || /^\s*$/.test(name) || !/^\d{10}$/.test(CI) || !/^[A-Za-z\s]*$/.test(name) ||
            voted === "" || permission === "") {
            setError(true)
            return
        }

        if (!editing){
            handleCreate()
        } else {
            handleUpdate(id)
            setEditing(false)
        }

        closeModal();

    };

    const handleCreate = () => {
        let has_voted = (voted === "true")
        axios.post(`${API}/user`, {
            ci: CI,
            user: name,
            voted: has_voted,
            permission: permission
        }).then(response=> {
            if (response.data.exists){
                alert("Cédula existente, por favor ingrese otra");
            } else {
                handleRead();
            }
        }).catch(error => {
            console.log(error);
        })
    };

    const handleUpdate = (user_id) => {
        let has_voted = (voted === "true")
        let person = {
            ci: CI,
            user: name,
            voted: has_voted,
            permission: permission
        }
        axios.post(`${API}/user/${user_id}`, person).then(response=>{
            handleRead();
        }).catch(error =>{
            console.log(error);
        })
    }

    const handleDelete = (user_id) => {
        axios.delete(`${API}/user/${user_id}`).then(response =>{
            handleRead();
            setId('')
        }).catch(error =>{
            console.log(error);
        })
    }

    const getEdit = (user_id) => {
        axios.get(`${API}/user/${user_id}`).then(response=> {

            setEditing(true)

            setId(user_id)
            setCI(response.data.ci)
            setName(response.data.user)
            setVoted(response.data.voted.toString())
            setPermission(response.data.permission)
            openModal()
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div>
            {modalVisible && (
                <div className="modal-container">
                    <div className="contenedor-U">
                        <form className='card card-body'>
                            {error && <div className="alert alert-danger" role="alert" style={{ textAlign: "center" }}>
                                Datos incorrectos
                            </div>}
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="ci"
                                    className="form-control"
                                    value={CI}
                                    onChange={(e) => setCI(e.target.value)}
                                />
                                <label htmlFor="floatingTextarea">Cédula de identidad</label>
                            </div>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label htmlFor="floatingTextarea">Nombre y Apellido</label>
                            </div>
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    value={voted}
                                    onChange={(e) => setVoted(e.target.value)}>
                                    <option disabled={true} value="">
                                        Escoge una opción
                                    </option>
                                    <option value="true">true</option>
                                    <option value="false">false</option>
                                </select>
                                <label htmlFor="floatingSelect">Voto:</label>
                            </div>
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    value={permission}
                                    onChange={(e) => setPermission(e.target.value)}>
                                    <option disabled={true} value="">
                                        Escoge una opción
                                    </option>
                                    <option value="voter">voter</option>
                                    <option value="admin">admin</option>
                                </select>
                                <label htmlFor="floatingSelect">Permisos:</label>
                            </div>
                            <div className="d-flex justify-content-center" >
                            <button type="button" className='btn btn-primary' style={{ marginRight: '50px' }}
                                    onClick={handleSubmit}>
                                Aceptar
                            </button>
                            <button type="button" className='btn btn-primary btn-block'
                                    onClick={closeModal}>
                                Cancelar
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className='d-flex justify-content-center align-items-center'>
                <p style={{ fontSize: '30px', textAlign: 'center' }}>
                    <strong>Administrar Usuarios</strong>
                </p>
            </div>
            <div className='contenedor-U'>
                <div className='centrar'>
                    <div className='col-md-8' >
                        <div className="input-group mb-3">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Ingrese el dato del usuario a buscar"
                                   aria-label=""
                                   aria-describedby="basic-addon1"
                                   onChange={(e) => setSearch(e.target.value)}/>
                            <div className='d-flex' style={{ marginLeft: '200px' }}>
                                <button type="button" className="btn btn-primary" onClick={openModal}>Insertar</button>
                            </div>
                        </div>
                        <table className='table table-striped table-hover'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cédula</th>
                                    <th>Nombre y Apellido</th>
                                    <th>Voto</th>
                                    <th>Permiso</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {users.filter((item)=>{
                                return search.toLowerCase() === ''
                                ? item : item.ci.toLowerCase().includes(search) ||
                                    item.user.toLowerCase().includes(search)
                            }).map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.ci}</td>
                                    <td>{item.user}</td>
                                    <td>{item.voted ? 'true' : 'false'}</td>
                                    <td>{item.permission}</td>
                                    <td className='text-end'>
                                        <button className='btn btn-success btn-sm btn-block'
                                        onClick={() => getEdit(item._id)}>
                                            Editar
                                        </button>
                                        <button className='btn btn-danger btn-sm btn-block'
                                                onClick={() => handleDelete(item._id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
};
