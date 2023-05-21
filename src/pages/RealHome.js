import {useEffect, useState} from "react";
import Axios from "axios";
import '../styles/realHome.css';
import {Link} from "react-router-dom";

export default function RealHome() {

    const [ispiti, setIspiti] = useState([]);

    const fetchIspite = () => {
        Axios.get("http://localhost:8080/ispiti").
        then(res => {
            setIspiti(res.data);
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

    useEffect(() => {
        fetchIspite();
    }, []);

    return (
        <div className="mrgn">
            <div className="mb-10 bg-stone-100 inline-block rounded-sm shadow-md w-1/5 h-12 flex justify-center items-center"><p data-testid="todo-1" className="font-semibold text-2xl">Ispiti</p></div>
            <div className="mb-12">
            {ispiti.map(ispit => (
                <Link to={"ispiti/" + ispit.ispitId.predmetId + "/" + ispit.ispitId.ispitId} className="h-12 rounded-sm shadow-md hover:bg-stone-300 bg-stone-100 flex justify-evenly items-center mb-6 text-lg">
                    <span className="w-1/5 ml-4">{ispit.vrsta}</span>
                    <span className="w-1/5">{new Date(ispit.datum).getDate() + ". " + (new Date(ispit.datum).getMonth() + 1) + ". " + new Date(ispit.datum).getFullYear() + "."}</span>
                    <span className="w-2/5">{ispit.napomena}</span>
                    <span className="w-1/5">{ispit.nazivGodina}</span>
                </Link>
            ))}
            </div>
            <Link to="/dodajIspit" className="text-lg hover:bg-amber-500 bg-amber-300 rounded-md shadow-md py-2.5 px-8">Dodaj novi ispit</Link>
        </div>
    )
}