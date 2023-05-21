import '../styles/home.css';
import {useEffect, useRef, useState} from 'react';
import Axios from 'axios';
import {Link, useNavigate, useParams} from "react-router-dom";
import '../styles/modal.css';

export default function Home() {

    const [ucenici, setUcenici] = useState([]);
    const [ispitiPredmet, setIspitiPredmet] = useState({});
    const [predmeti, setPredmeti] = useState([]);
    const [ocjene, setOcjene] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [formState, setFormState] = useState(false);
    const [errorMsgOcjena, setErrorMsgOcjena] = useState("");
    const [errorMsgOcjenaModal, setErrorMsgOcjenaModal] = useState("");
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [errorReturn, setErrorReturn] = useState("");
    const [data, setData] = useState({
        vrsta : "",
        datum : "",
        napomena : ""
    });
    const [startingModalData, setStartingModalData] = useState({})
    const navigate = useNavigate();
    const ocjenaRef = useRef(null);
    const napomenaRef = useRef(null);

    const {predmetId, ispitId} = useParams();


    const fetchIspit = () => {
        Axios.get(`http://localhost:8080/ispiti/${predmetId}/${ispitId}`).then(res => {
            setIspitiPredmet(res.data);
            setPredmeti(res.data.predmeti);
            setOcjene(res.data.ocjene);
            setUcenici(res.data.ucenici);
            setData({
                vrsta : res.data.vrsta,
                datum : res.data.datum,
                napomena : res.data.napomena
            })
            console.log(res.data);
        }).catch((error) => { // error is handled in catch block
            navigate("/dodajIspit");
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

    useEffect(() => {
        fetchIspit();
    }, []);

    const [ocjena, setOcjena] = useState({
        ispitId : ispitId,
        predmetId : predmetId,
        korisnikId : null,
        ocjena : null,
        napomena : ""
    });

    const startingData = {
        vrsta : ispitiPredmet.vrsta,
        datum : ispitiPredmet.datum,
        napomena : ispitiPredmet.napomena
    };

    const url = "localhost:3000/blabla";
    const [check, setCheck] = useState({nulls : true, same : true});

    function handle(e) {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
        console.log(newData)
    }

    function handleOcjena(e) {
        const newOcjena = {...ocjena}
        newOcjena[e.target.id] = e.target.value
        setOcjena(newOcjena)
        console.log(newOcjena)
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

    function checkIfSame(selectedId) {
        for(const key in data) {
            if (!(data[key] === startingData[key]))
                return true;
        }
        if(selectedId !== ispitiPredmet.ispitId.predmetId) return true;
        setErrorMsg("Niste promijenili niti jedno polje!")
        return false;
    }

    function checkIfSameModal(selectedId) {
        if(Number(selectedId) === startingModalData.korisnikId && Number(ocjenaRef.current.value) === startingModalData.ocjena && napomenaRef.current.value === startingModalData.napomena) {
            setErrorMsgOcjenaModal("Niste promijenili niti jedno polje!");
            return false;
        }
        return true;

    }

    function submit(e) {
        e.preventDefault();
        const selectedValue = document.getElementById("predmet").value;
        if(validateForm(data, setErrorMsg) && checkIfSame(selectedValue)) {
            Axios.put(`http://localhost:8080/ispiti/${ispitiPredmet.ispitId.predmetId}/${ispitiPredmet.ispitId.ispitId}`, {
                ispitId : ispitiPredmet.ispitId.ispitId,
                predmetId : Number(selectedValue),
                vrsta : data.vrsta,
                datum : data.datum,
                napomena : data.napomena
            })
                .then(res => {
                    navigate(`/ispiti/${res.data.ispitId.predmetId}/${res.data.ispitId.ispitId}`)
                    window.location.reload();
                }).catch((error) => { // error is handled in catch block

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

    function submitOcjena(e) {
        e.preventDefault();
        const selectedId = document.getElementById("ucenik").value;
        if(validateForm(ocjena, setErrorMsgOcjena)) {
            Axios.post("http://localhost:8080/ispiti/ocjena", {
                ispitId : ispitId,
                predmetId : predmetId,
                korisnikId : Number(selectedId),
                ocjena : Number(ocjena.ocjena),
                napomena : ocjena.napomena
            })
                .then(res => {
                    window.location.reload();
                }).catch((error) => { // error is handled in catch block
                    setErrorReturn(error.response.data.message);
                    toggleModal2(modal3, setModal3)
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

    function submitModal(e) {
        e.preventDefault();
        const selectedIdModal = document.getElementById("modalUcenik").value;
        if(validateForm({ocjena : ocjenaRef.current.value, napomena : napomenaRef.current.value}, setErrorMsgOcjenaModal) && checkIfSameModal(selectedIdModal)) {
            Axios.put(`http://localhost:8080/ispiti/ocjena/${predmetId}/${ispitId}/${startingModalData.korisnikId}`, {
                ispitId : ispitId,
                predmetId : predmetId,
                korisnikId : selectedIdModal,
                ocjena : ocjenaRef.current.value,
                napomena : napomenaRef.current.value
            })
                .then(res => {
                    window.location.reload();
                }).catch((error) => { // error is handled in catch block
                setErrorReturn(error.response.data.message);
                toggleModal2(modal3, setModal3)
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

    function resetAll() {
        setData(startingData);
        setErrorMsg("");
    }

    function deleteIspit() {
        Axios.delete(`http://localhost:8080/ispiti/${predmetId}/${ispitId}`)
            .then(res => {
                    navigate(`/ispiti/${res.data.ispitId.predmetId}/${res.data.ispitId.ispitId}`)
                    window.location.reload();
                }
            ).catch((error) => { // error is handled in catch block
            navigate("/dodajIspit");
        });
    }

    function prethodni() {
        Axios.get(`http://localhost:8080/ispiti/${predmetId}/${ispitId}/prosli`)
            .then(function (response) {
                navigate(`/ispiti/${response.data.ispitId.predmetId}/${response.data.ispitId.ispitId}`)
                window.location.reload();
            }).catch((error) => { // error is handled in catch block
            setErrorReturn(error.response.data.message);
            toggleModal2(modal3, setModal3)
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

    function sljedeci() {
        Axios.get(`http://localhost:8080/ispiti/${predmetId}/${ispitId}/sljedeci`)
            .then(function (response) {
                navigate(`/ispiti/${response.data.ispitId.predmetId}/${response.data.ispitId.ispitId}`)
                window.location.reload();
            }).catch((error) => { // error is handled in catch block
            setErrorReturn(error.response.data.message);
            toggleModal2(modal3, setModal3)
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

    function showForm(e, id) {
        if(formState) {
            document.getElementById(id).style.display = "none";
            setFormState(false);
        } else {
            document.getElementById(id).style.display = "block";
            setFormState(true);
        }
    }

    function obrisiOcjenu(korisnikId) {
        Axios.delete(`http://localhost:8080/ispiti/${predmetId}/${ispitId}/${korisnikId}`)
            .then(res => {
                    window.location.reload();
                    console.log(res.data)
                }
            ).catch((error) => { // error is handled in catch block
            setErrorReturn(error.response.data.message);
            toggleModal2(modal3, setModal3)
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

    const toggleModal = (ocjena) => {
        setErrorMsgOcjenaModal("")
        setModal(!modal);
        if(ocjena !== null) {
            setStartingModalData({
                imePrezime: ocjena.ucenici[0].imePrezime,
                ocjena: ocjena.ocjena,
                napomena: ocjena.napomena,
                ucenici: ocjena.ucenici,
                korisnikId : ocjena.ucenici[0].korisnikId
            })
        }
    }

    const toggleModal2 = (modal, setModal) => {
        setModal(!modal);
    }

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }
    if(modal2) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }
    if(modal3) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <div className="margins">
            <button onClick={prethodni} className="hover:bg-blue-400 bg-blue-300 rounded-md shadow-md py-1.5 px-5 mr-3">
                <p>Prethodni</p>
            </button>
            <button onClick={sljedeci} className="hover:bg-blue-400 bg-blue-300 rounded-md shadow-md py-1.5 px-5 mr-3">
                <p>Sljedeći</p>
            </button>
            <Link to="/dodajIspit" className="hover:bg-amber-500 bg-amber-300 rounded-md shadow-md py-1.5 px-5">Dodaj novi ispit</Link>
            <form id="masterForm" className="mt-5 h-50" method="POST" onSubmit={e => {submit(e)}
            }>
                <div className="flex">
                    <div className="mr-8">
                        <label htmlFor="vrsta" className="block font-semibold">Vrsta:</label>
                        <input onChange={(event => handle(event))} value={data.vrsta} className="border-2 border-gray-500 rounded-md p-1 w-60" type="text" id="vrsta"
                               name="vrsta"
                        />
                    </div>
                    <div>
                        <label htmlFor="predmet" className="block font-semibold">Predmet:</label>
                        <select id="predmet" name="predmet" className="border-2 border-gray-500 rounded-md p-1 w-60">
                            {predmeti.map(predmet => (
                                <option value={predmet.predmetId}>{predmet.nazivGodina}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <label htmlFor="datum" className="block font-semibold mt-5">Datum:</label>
                <input onChange={(event => handle(event))} value={data.datum} className="border-2 border-gray-500 rounded-md p-1 w-60" type="date" id="datum" name="datum"/>
                <label htmlFor="napomena" className="block font-semibold mt-5">Napomena:</label>
                <input onChange={(event => handle(event))} value={data.napomena} className="border-2 border-gray-500 rounded-md p-1 w-60 block mb-4" type="text" id="napomena"
                       name="napomena"/>
                <div className="mb-4">{errorMsg}</div>
                <button type="submit" value="Submit" className="hover:bg-green-500 bg-green-300 rounded-md shadow-md py-1.5 px-5 mr-3">
                    <p>Spremi</p>
                </button>
                <button type="button" onClick={deleteIspit} className="hover:bg-red-600 bg-red-400 rounded-md shadow-md py-1.5 px-5 mr-3">
                    <p>Obriši</p>
                </button>
                <button onClick={resetAll} type="reset" className="hover:bg-gray-600 bg-gray-400 rounded-md shadow-md py-1.5 px-5">
                    <p>Resetiraj</p>
                </button>
            </form>
            <hr className="my-10 border-2 rounded-md border-gray-500 w-5/6" />

            <div className="mb-10 bg-stone-100 inline-block rounded-sm shadow-md w-28 flex justify-center"><p className="font-semibold text-2xl">Ocjene</p></div>


            <div className="relative overflow-x-auto mb-10">
                <table className="w-3/5 text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            #
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Učenik
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Ocjena
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Bilješka
                        </th>
                        <th scope="col" className="px-3 py-3" />
                        <th scope="col" className="px-3 py-3" />
                    </tr>
                    </thead>
                    <tbody>
                    {
                        ocjene.map((ocjena1,index) => (
                                <tr className="bg-white border-b">
                                    <td scope="row"
                                        className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        {ocjena1.ucenici[0].imePrezime}
                                    </td>
                                    <td scope="row"
                                        className="px-6 py-4 ">
                                        {ocjena1.ocjena}
                                    </td>
                                    <td className="px-6 py-4">
                                        {ocjena1.napomena}
                                    </td>
                                    <td>
                                        <button onClick={() => {toggleModal(ocjena1)}} className="hover:bg-orange-500 bg-orange-400 text-white py-1.5 px-5 rounded-md shadow-md">Uredi</button>
                                    </td>
                                    <td>
                                        <button onClick={() => {obrisiOcjenu(ocjena1.ucenici[0].korisnikId)}} className="hover:bg-red-700 bg-red-500 text-white py-1.5 px-5 rounded-md shadow-md">Obriši</button>
                                    </td>
                                </tr>
                            )
                        )
                    }
                    </tbody>
                </table>
            </div>

            <button onClick={(e => showForm(e, "formOcjena"))} className="mb-10 focus:bg-blue-400 hover:bg-blue-400 bg-blue-300 rounded-md shadow-md py-1.5 px-5">Dodaj ocjenu</button>
            <form id="formOcjena" className="ocjenaForma mb-10 h-50" method="POST" onSubmit={e => submitOcjena(e)}>
                <label htmlFor="ocjena" className="block font-semibold ">Ocjena:</label>
                <input onChange={(event => handleOcjena(event))} value={ocjena.ocjena} className="border-2 border-gray-500 rounded-md p-1 w-60 mb-4" min="1" max="5" type="number" id="ocjena"
                       name="ocjena"
                />
                <div>
                    <label htmlFor="ucenik" className="block font-semibold">Ucenik:</label>
                    <select id="ucenik" name="ucenik" className="border-2 border-gray-500 rounded-md p-1 w-60">
                        {ucenici.map(ucenik => (
                            <option value={ucenik.korisnikId}>{ucenik.imePrezime}</option>
                        ))}
                    </select>
                </div>
                <label htmlFor="napomena" className="block font-semibold mt-5">Bilješka:</label>
                <input onChange={(event => handleOcjena(event))} value={ocjena.napomena} className="border-2 border-gray-500 rounded-md p-1 w-60" type="text" id="napomena" name="napomena"/>
                <div className="my-4">{errorMsgOcjena}</div>
                <button type="submit" value="Submit" className="hover:bg-green-500 bg-green-300 rounded-md shadow-md py-1.5 px-5 mr-3">
                    <p>Dodaj</p>
                </button>
            </form>
            {modal && <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                    <p className="text-xl font-semibold">Uredi ocjenu</p>
                    <form id="modalForm" method="post" onSubmit={e => submitModal(e)}>
                        <div>
                            <label htmlFor="modalUcenik" className="block font-semibold mt-5">Učenik:</label>
                            <select id="modalUcenik" name="modalUcenik" className="border-2 border-gray-500 rounded-md p-1 w-60">
                                {startingModalData.ucenici.map(ucenik => (
                                    <option value={ucenik.korisnikId}>{ucenik.imePrezime}</option>
                                ))}
                            </select>
                        </div>
                        <label htmlFor="modalOcjena" className="block font-semibold mt-5">Ocjena:</label>
                        <input defaultValue={startingModalData.ocjena} ref={ocjenaRef} className="border-2 border-gray-500 rounded-md p-1 w-60" min="1" max="5" type="number" id="modalOcjena"
                               name="modalOcjena"
                        />
                        <label htmlFor="modalNapomena" className="block font-semibold mt-5">Bilješka:</label>
                        <input defaultValue={startingModalData.napomena} ref={napomenaRef} className="border-2 border-gray-500 rounded-md p-1 w-60 mb-5" type="text" id="modalNapomena" name="modalNapomena"/>
                        <div className="my-4">{errorMsgOcjenaModal}</div>
                        <div className="flex justify-center items-center mb-4">
                            <button type="submit" value="Submit" className="bg-green-400 hover:bg-green-500 rounded-md shadow-md py-1.5 px-5 mr-3"><p>Spremi</p></button>
                        </div>
                    </form>
                    <button className="close-modal bg-red-500 hover:bg-red-700 text-white rounded-sm shadow-md" onClick={() => {setErrorMsgOcjenaModal("")
                        toggleModal(null)}}>CLOSE</button>
                </div>
            </div>}

            {modal3 && <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                    <p className="mb-5 text-xl font-semibold">Greška!</p>
                    <p className="text-lg">{errorReturn}</p>
                    <button className="close-modal bg-red-500 hover:bg-red-700 text-white rounded-sm shadow-md" onClick={() => {
                        toggleModal2(modal3, setModal3)}}>CLOSE</button>
                </div>
            </div>}

        </div>
    )


}