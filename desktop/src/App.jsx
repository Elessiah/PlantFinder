import React, {useEffect, useRef, useState} from 'react';
import "./styles/App.css";
import ResearchBar from "./ResearchBar.jsx";
import LoadData from "./functions/LoadData.js";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const App = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const [data, setData] = React.useState([]);
    const [visible, setVisible] = React.useState(false);

    const formatData = (data) => {
        return data.replace("\\dqu", '"').replace("\\qu", "'");
    };

    const indexToText = (value) => {
        return `${value}`;
    }

    const handleNext = () => {
        if (currentIndex < data.length)
            setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };

    const handlePrev = () => {
        if (currentIndex > 0)
            setCurrentIndex((prevIndex) => (prevIndex - 1) % data.length);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
                handleNext();
            } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'q') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    })

    useEffect(() => {
        const container = containerRef.current;
        let startX = 0;
        let isDown = false;

        const handleMouseDown = (e) => {
            isDown = true;
            startX = e.clientX;
        };

        const handleMouseUp = (e) => {
            isDown = false;
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            const diff = startX - e.clientX;
            if (diff > 50) {
                handleNext();
                isDown = false;
            } else if (diff < -50) {
                handlePrev();
                isDown = false;
            }
        };

        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mousemove', handleMouseMove);
        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    return (
        <div className={"MainContent"}>
            {visible && (
                <div className="modal">
                    <div className={"modal-content"}>
                        <p>Chargement des données...</p>
                        <p>Veuillez patienter...</p>
                    </div>
                </div>
            )}

            <ResearchBar setData={setData} />

            <div className={"carousel"} ref={containerRef}>
                {data.map((item, index) => (
                    <div
                    key={index}
                    className={`slide ${index === currentIndex ? 'active' : 'hidden'}`}
                    style={{
                        backgroundColor: index % 3 === 0 ? "#0e4404" : index % 3 === 1 ? "#047c49" : "#88421d",
                    }}
                    >
                        <h2 className={"slide-title"}>{formatData(item.name)}</h2>
                        <h3 className={"slide-subTitle"}>Symptômes :</h3>
                        <p className={"slide-content"}>{formatData(item.symptoms)}</p>
                        <h3 className={"slide-subTitle"}>Contre-indication :</h3>
                        <p className={"slide-content"}>{formatData(item.contradication)}</p>
                        <h3 className={"slide-subTitle"}>Parties utilisées :</h3>
                        <p className={"slide-content"}>{formatData(item.parts)}</p>
                    </div>
                ))}
            </div>

            <Box sx={{ width: data.length * 20, color: "#9a630f", '& .MuiSlider-thumb': {
                    backgroundColor: "#9a630f", // Change la couleur du bouton
                },
                '& .MuiSlider-track': {
                    backgroundColor: "#9a630f", // Change la couleur de la ligne active
                },
                '& .MuiSlider-rail': {
                    backgroundColor: "#c88751", // Change la couleur de la ligne inactive
                }, }}>
                <Slider
                    aria-label={"Carousel-Slide"}
                    defaultValue={currentIndex}
                    getAriaValueText={indexToText}
                    onChange={(event, newValue) => setCurrentIndex(newValue)}
                    value={currentIndex}
                    valueLabelDisplay={"auto"}
                    shiftStep={1}
                    step={1}
                    marks
                    min={0}
                    max={data.length - 1}
                    />
            </Box>

            <div className={"bottom-buttons"}>
                <input
                    type={"file"}
                    accept={".csv"}
                    id={"fileInput"}
                    onChange={async (event) => {
                        console.log("Loading data...")
                        setData([]);
                        setVisible(true);
                        await LoadData(event);
                        setVisible(false);
                        console.log("Data loaded !");
                    }}
                />
                <button
                    className={"reset"}
                    onClick={async () => {
                        await window.electron.reset();
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default App;