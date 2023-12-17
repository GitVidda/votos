import './styles.css';
import {useEffect, useState} from "react";
import axios from 'axios';

const API = process.env.REACT_APP_API;
export const AdminL = () => {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');

    const [error, setError] = useState(false);
    const [lists, setLists] = useState([]);
    const [editing, setEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        handleRead();
    }, [])

    const openModal = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
        setName('')

        setError(false);

        setModalVisible(false);


    }

    const handleRead = () => {
        axios.get(`${API}/lists`).then(response => {
            setLists(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/^[A-Za-z\s]*$/.test(name) || /^\s*$/.test(name)) {
            setError(true)
            return
        }

        if (!editing){
            handleCreate()
        } else {
            handleUpdate(id)
            setEditing(false)
        }

        closeModal()

    };

    const handleCreate = () => {
        axios.post(`${API}/list`, {name: name}).then(response=> {
            console.log(response);
            if (response.data.exists){
                alert("Candidato existente, por favor ingrese otro Nombre");
            } else {
                handleRead();
            }
        }).catch(error => {
            console.log(error);
        })
    };

    const handleUpdate = (list_id) => {
        axios.post(`${API}/list/${list_id}`, {name: name}).then(response=>{
            handleRead();
        }).catch(error =>{
            console.log(error);
        })
    }

    const handleDelete = (list_id) => {
        axios.delete(`${API}/list/${list_id}`).then(response =>{
            handleRead();
            setId('')
        }).catch(error =>{
            console.log(error);
        })
    }

    const getEdit = (list_id) => {
        axios.get(`${API}/list/${list_id}`).then(response=> {

            setEditing(true)

            setId(list_id)
            setName(response.data.name)
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
                                    id="name"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label htmlFor="floatingTextarea">Nombre y Apellido</label>
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
                    <strong>Administrar Listas</strong>
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
                                <th>Nombre</th>
                                <th>Votos</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {lists.filter((item)=>{
                                return search.toLowerCase() === ''
                                    ? item : item.name.toLowerCase().includes(search)
                            }).map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.votes}</td>
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
