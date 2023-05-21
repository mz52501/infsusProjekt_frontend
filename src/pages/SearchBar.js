import "../styles/SearchBar.css"
import { GoSearch } from "react-icons/go";
import { MdClose } from "react-icons/md";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {RiFilePaper2Fill} from "react-icons/ri";

export default function SearchBar() {

    const[predmeti,setPredmeti] = useState([]);
    const[filteredData, setFilteredData] = useState([]);
    const[wordEntered, setWordEntered] = useState("");

    const fetchPredmeti = () => {
        axios.get("http://localhost:8080/predmeti").then(res => {
            setPredmeti(res.data);
        });
    };

    useEffect(() => {
        fetchPredmeti();
    }, []);

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = predmeti.filter((value) => {
            return value.nazivGodina.toLowerCase().includes(searchWord.toLowerCase());
        });
        if(searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    }

    const clearInput = () => {
        setFilteredData([]);
        setWordEntered("");
    }

    return (
        <div className="search shadow-md rounded-sm">
            <div className="searchInputs">
                <input
                    type="text"
                    value={wordEntered}
                    placeholder="Upišite razred iz kojeg tražite ispit"
                    onChange={handleFilter}
                />
                <div className="searchIcon">
                    {wordEntered.length === 0 ?(
                        <GoSearch />
                    ) : ( <MdClose className="clearBtn" onClick={clearInput} />
                    )}
                </div>
            </div>
        </div>
    );
}