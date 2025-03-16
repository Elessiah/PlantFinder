import React from 'react';
import {useEffect, useState} from "react";
import getKeywords from "./functions/getKeywords.js";
import "./styles/ResearchBar.css"

export default function ResearchBar({ setData }) {
    const [text, setText] = useState('');
    const [research, setResearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (research.length > 0) {
                setData([]);
                const keywords = getKeywords(research);
                const result = await window.electron.getPlantsFromKeywords(keywords);
                if (result !== null)
                    setData(result);
            }
        }
        fetchData().then();
    }, [research, setData]);

    return (
        <div className={"researchBar"}>
            <input
                className={"researchBar-input"}
                placeholder={"Rechercher"}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        setResearch(text);
                    }
                }}
            />
        </div>
    );
}