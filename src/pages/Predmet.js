import '../styles/predmet.css';
import Axios from "axios";
import {useEffect, useRef, useState} from "react";

export default function Predmet() {

    const [predmeti, setPredmeti] = useState([]);
    const [modal, setModal] = useState(false);
    const [startingModalData, setStartingModalData] = useState({});
    const [errorMsgModal, setErrorMsgModal] = useState("");
    const [errorReturn, setErrorReturn] = useState("");
    const [modal2, setModal2] = useState(false);
    const nazivRef = useRef(null);
    const godinaRef = useRef(null);

    const fetchPredmeti = () => {
        Axios.get(`http://localhost:8080/predmeti`).then(res => {
            setPredmeti(res.data);
        });
    };

    useEffect(() => {
        fetchPredmeti();
    }, []);

    const [errorMsg, setErrorMsg] = useState("");
    const [formState, setFormState] = useState(false);
    const [data, setData] = useState({
        naziv : "",
        godina : null
    });

    function handle(e) {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
        console.log(newData)
    }

    function validateForm(data, setErrorMsg) {
        for(const key in data) {
            if (data[key] === "") {
                setErrorMsg("Popunite prazna polja!")
                return false;
            }
        }
        return true
    }

    /*function checkIfSame() {
        for(const key in data) {
            if (!(data[key] === startingData[key]))
                return true;
        }
        setErrorMsg("Niste promijenili niti jedno polje!")
        return false;
    }*/

    function submit(e) {
        e.preventDefault();
        if(validateForm()) {
            Axios.post("http://localhost:8080/predmet", {
                naziv : data.naziv,
                godina : data.godina
            })
                .then(res => {
                    console.log(res.data)
                    window.location.reload();
                }).catch((error) => { // error is handled in catch block
                setErrorReturn(error.response.data.message);
                toggleModal2(modal2, setModal2)
                if (error.response) { // status code out of the range of 2xx
                    console.log("Data :" , error.response.data);
                    console.log("Status :" + error.response.status);
                } else if (error.request) { // The request was made but no response was received
                    console.log(error.request);
                } else {// Error on setting up the request
                    console.log('Error', error.message);
                }
            });
        }

    }


    const prva_god = [];
    const druga_god = [];
    const treca_god = [];
    const cetvrta_god = [];

    predmeti.sort( (a,b) => {
        if(a.naziv > b.naziv) return 1;
        else if (b.naziv > a.naziv) return -1;
        else return 0;
    });

    predmeti.map(predmet => {
            if (predmet.godina === 1) prva_god.push(predmet);
            else if (predmet.godina === 2) druga_god.push(predmet);
            else if (predmet.godina === 3) treca_god.push(predmet);
            else cetvrta_god.push(predmet)
        }

    );

        function showForm(e, id) {
        if(formState) {
            document.getElementById(id).style.display = "none";
            setFormState(false);
        } else {
        document.getElementById(id).style.display = "block";
        setFormState(true);
            }
        }

    function obrisiPredmet(predmetId) {
        Axios.delete(`http://localhost:8080/predmeti/${predmetId}`)
            .then(res => {
                    window.location.reload();
                    console.log(res.data)
                }
            ).catch((error) => { // error is handled in catch block
            setErrorReturn(error.response.data.message);
            toggleModal2(modal2, setModal2)
            if (error.response) { // status code out of the range of 2xx
                console.log("Data :" , error.response.data);
                console.log("Status :" + error.response.status);
            } else if (error.request) { // The request was made but no response was received
                console.log(error.request);
            } else {// Error on setting up the request
                console.log('Error', error.message);
            }
        });
    }

    function checkIfSameModal() {
        if(Number(godinaRef.current.value) === startingModalData.godina && nazivRef.current.value === startingModalData.naziv) {
            setErrorMsgModal("Niste promijenili niti jedno polje!");
            return false;
        }
        return true;

    }

    function submitModal(e) {
        e.preventDefault();
        if(validateForm({naziv : nazivRef.current.value, godina : godinaRef.current.value}, setErrorMsgModal) && checkIfSameModal()) {
            Axios.put("http://localhost:8080/predmet", {
                predmetId : startingModalData.predmetId,
                naziv : nazivRef.current.value,
                godina : Number(godinaRef.current.value)
            })
                .then(res => {
                    window.location.reload();
                }).catch((error) => { // error is handled in catch block
                setErrorReturn(error.response.data.message);
                toggleModal2(modal2, setModal2)
                if (error.response) { // status code out of the range of 2xx
                    console.log("Data :" , error.response.data);
                    console.log("Status :" + error.response.status);
                } else if (error.request) { // The request was made but no response was received
                    console.log(error.request);
                } else {// Error on setting up the request
                    console.log('Error', error.message);
                }
            });
        }


    }

    const toggleModal = (data) => {
        setErrorMsgModal("")
        setModal(!modal);
        if(data !== null) {
            setStartingModalData({
                predmetId: data.predmetId,
                naziv: data.naziv,
                godina : data.godina
            })
        }
    }

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    const toggleModal2 = (modal, setModal) => {
        setModal(!modal);
    }

    if(modal2) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <div className="margine">
            <div className="bg-stone-100 w-36 h-10 inline-block rounded-sm shadow-md w-28 flex justify-center items-center">
                <p className="font-semibold text-2xl">
                    Predmeti
                </p>
            </div>
            {prva_god.length > 0 ?
                <div>
                <p className="mt-10 text-lg font-semibold mb-2">Prva godina: </p>
                    <div className="relative overflow-x-auto mb-10">
                        <table className="w-3/5 text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Naziv
                                </th>
                                <th scope="col" className="px-6 py-3">
                                </th>
                                <th scope="col" className="px-6 py-3">
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                    {prva_god.map((predmet, index) => (
                        <tr className="bg-white border-b">
                            <td scope="row"
                                className="px-6 py-4">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4">
                                <div className="w-13">{predmet.naziv}</div>
                            </td>
                            <td>
                                <button onClick={() => {toggleModal(predmet)}} className="hover:bg-orange-500 bg-orange-400 text-white py-1.5 px-5 rounded-md shadow-md">Uredi</button>
                            </td>
                            <td>
                                <button onClick={() => {obrisiPredmet(predmet.predmetId)}} className="hover:bg-red-700 bg-red-500 text-white py-1.5 px-5 rounded-md shadow-md">Obriši</button>
                            </td>
                        </tr>
                    ))}
                            </tbody>
                        </table>
                </div>
                </div>
                : <></>}
            {druga_god.length > 0 ?
                <div>
                    <p className="mt-5 text-lg font-semibold mb-2">Druga godina: </p>
                    <div className="relative overflow-x-auto mb-10">
                        <table className="w-3/5 text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Naziv
                                </th>
                                <th scope="col" className="px-6 py-3">
                                </th>
                                <th scope="col" className="px-6 py-3">
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {druga_god.map((predmet, index) => (
                                <tr className="bg-white border-b">
                                    <td scope="row"
                                        className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="min-w-max">{predmet.naziv}</div>
                                    </td>
                                    <td>
                                        <button onClick={() => {toggleModal(predmet)}} className="hover:bg-orange-500 bg-orange-400 text-white py-1.5 px-5 rounded-md shadow-md">Uredi</button>
                                    </td>
                                    <td>
                                        <button onClick={() => {obrisiPredmet(predmet.predmetId)}} className="hover:bg-red-700 bg-red-500 text-white py-1.5 px-5 rounded-md shadow-md">Obriši</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                : <></>}
            {treca_god.length > 0 ?
                <div>
                    <p className="mt-5 text-lg font-semibold mb-2">Treća godina: </p>
                    <div className="relative overflow-x-auto mb-10">
                        <table className="w-3/5 text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Naziv
                                </th>
                                <th scope="col"/>
                                <th scope="col"/>
                            </tr>
                            </thead>
                            <tbody>
                            {treca_god.map((predmet, index) => (
                                <tr className="bg-white border-b">
                                    <td scope="row"
                                        className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-13">{predmet.naziv}</div>
                                    </td>
                                    <td>
                                        <button onClick={() => {toggleModal(predmet)}} className="hover:bg-orange-500 bg-orange-400 text-white py-1.5 px-5 rounded-md shadow-md">Uredi</button>
                                    </td>
                                    <td>
                                        <button onClick={() => {obrisiPredmet(predmet.predmetId)}} className="hover:bg-red-700 bg-red-500 text-white py-1.5 px-5 rounded-md shadow-md">Obriši</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                : <></>}
            {cetvrta_god.length > 0 ?
                <div>
                    <p className="mt-5 text-lg font-semibold mb-2">Četvrta godina: </p>
                    <div className="relative overflow-x-auto mb-10">
                        <table className="w-3/5 text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Naziv
                                </th>
                                <th scope="col" className="px-6 py-3">
                                </th>
                                <th scope="col" className="px-6 py-3">
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {cetvrta_god.map((predmet, index) => (
                                <tr className="bg-white border-b">
                                    <td scope="row"
                                        className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-13">{predmet.naziv}</div>
                                    </td>
                                    <td>
                                        <button onClick={() => {toggleModal(predmet)}} className="hover:bg-orange-500 bg-orange-400 text-white py-1.5 px-5 rounded-md shadow-md">Uredi</button>
                                    </td>
                                    <td>
                                        <button onClick={() => {obrisiPredmet(predmet.predmetId)}} className="hover:bg-red-700 bg-red-500 text-white py-1.5 px-5 rounded-md shadow-md">Obriši</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                : <></>}

            <button onClick={(event => showForm(event, "newPredmet"))} className="mb-10 focus:bg-blue-400 hover:bg-blue-400 bg-blue-300 rounded-md shadow-md py-1.5 px-5">Dodaj predmet</button>
            <form id="newPredmet" className="forma mb-10 h-50" method="POST" onSubmit={e => submit(e)}>
                <label htmlFor="naziv" className="block font-semibold">Naziv:</label>
                <input onChange={(event => handle(event))} value={data.naziv} className="border-2 border-gray-500 rounded-md p-1 w-60" type="text" id="naziv"
                       name="naziv"
                />
                <label htmlFor="godina" className="block font-semibold mt-5">Godina:</label>
                <input onChange={(event => handle(event))} value={data.godina} className="border-2 border-gray-500 rounded-md p-1 w-60" min="1" max="4" type="number" id="godina" name="godina"/>
                <div className="mb-4">{errorMsg}</div>
                <button type="submit" value="Submit" className="hover:bg-green-500 bg-green-300 rounded-md shadow-md py-1.5 px-5 mr-3">
                    <p>Dodaj</p>
                </button>
            </form>
            {modal && <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                    <p className="text-xl font-semibold">Uredi ocjenu</p>
                    <form id="modalForm" method="post" onSubmit={e => submitModal(e)}>
                        <label htmlFor="modalNaziv" className="block font-semibold mt-5">Naziv:</label>
                        <input defaultValue={startingModalData.naziv} ref={nazivRef} className="border-2 border-gray-500 rounded-md p-1 w-60" type="text" id="modalNaziv"
                               name="modalNaziv"
                        />
                        <label htmlFor="modalGodina" className="block font-semibold mt-5">Godina:</label>
                        <input defaultValue={startingModalData.godina} ref={godinaRef} className="border-2 border-gray-500 rounded-md p-1 w-60 mb-5" type="number" id="modalGodina"  min="1" max="4" name="modalGodina"/>
                        <div className="my-4">{errorMsgModal}</div>
                        <div className="flex justify-center items-center mb-4">
                            <button type="submit" value="Submit" className="bg-green-400 hover:bg-green-500 rounded-md shadow-md py-1.5 px-5 mr-3"><p>Spremi</p></button>
                        </div>
                    </form>
                    <button className="close-modal bg-red-500 hover:bg-red-700 text-white rounded-sm shadow-md" onClick={() => {setErrorMsgModal("")
                        toggleModal(null)}}>CLOSE</button>
                </div>
            </div>}
            {modal2 && <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                    <p className="mb-5 text-xl font-semibold">Greška!</p>
                    <p className="text-lg">{errorReturn}</p>
                    <button className="close-modal bg-red-500 hover:bg-red-700 text-white rounded-sm shadow-md" onClick={() => {
                        toggleModal2(modal2, setModal2)}}>CLOSE</button>
                </div>
            </div>}
        </div>
    )


}