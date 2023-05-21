import '../styles/realHome.css'
import {useEffect, useState} from "react";
import Axios from "axios";
import {useNavigate} from "react-router-dom";

export default function AddIspit() {

    const [predmeti, setPredmeti] = useState([]);
    const [modal, setModal] = useState(false);
    const [errorReturn, setErrorReturn] = useState("");
    const [data, setData] = useState({
        vrsta: "",
        datum: "",
        napomena: ""
    });
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const fetchPredmeti = () => {
        Axios.get("http://localhost:8080/predmeti").then(res => {
            setPredmeti(res.data)
        }).catch((error) => { // error is handled in catch block
            setErrorReturn(error.response.data.message);
            toggleModal(modal, setModal)
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
        fetchPredmeti()}, []
    );


    function validateForm() {
        for(const key in data) {
            if(data[key] === "") {
                setErrorMsg("Popunite prazna polja!");
                return false;
            }
            return true;
        }
    }

    function submit(e) {
        e.preventDefault();
        const predmetId = document.getElementById("predmet").value;
        if(validateForm()) {
            Axios.post("http://localhost:8080/ispiti", {
                predmetId: predmetId,
                vrsta: data.vrsta,
                datum: data.datum,
                napomena: data.napomena
            }).then(res => {
                navigate(`/ispiti/${res.data.ispitId.predmetId}/${res.data.ispitId.ispitId}`)
                window.location.reload();
                }
            ).catch((error) => { // error is handled in catch block
                setErrorReturn(error.response.data.message);
                toggleModal(modal, setModal)
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

    function handle(e) {
        const newData = {...data};
        newData[e.target.id] = e.target.value
        setData(newData);
        console.log(newData);
    }

    function resetAll() {
        setData({vrsta: "",
            datum: "",
            napomena: ""})
    }

    const toggleModal = (modal, setModal) => {
        setModal(!modal);
    }

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <div className="mrgn">
            <div className="mb-10 bg-stone-100 inline-block rounded-sm shadow-md w-1/5 h-12 flex justify-center items-center"><p className="font-semibold text-2xl">Dodaj novi ispit</p></div>
            <form id="masterForm" className="mt-5 h-50" method="POST" onSubmit={e => submit(e)}>
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
                    <p>Dodaj</p>
                </button>
                <button onClick={() => {resetAll()}} type="reset" className="hover:bg-gray-500 bg-gray-400 rounded-md shadow-md py-1.5 px-5">
                    <p>Resetiraj</p>
                </button>
            </form>
            {modal && <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                    <p className="mb-5 text-xl font-semibold">Greška!</p>
                    <p className="text-lg">{errorReturn}</p>
                    <button className="close-modal bg-red-500 hover:bg-red-700 text-white rounded-sm shadow-md" onClick={() => {
                        toggleModal(modal, setModal)}}>CLOSE</button>
                </div>
            </div>}
        </div>
    )
}