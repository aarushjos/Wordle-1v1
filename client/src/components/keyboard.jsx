import { useState, useEffect } from 'react';
import './keyboard.css';

export default function Keyboard({ onKeyPress, letterStatus = {} }) {
    const [activeKeys, setActiveKeys] = useState(new Set());

    const row1 = "QWERTYUIOP".split("");
    const row2 = "ASDFGHJKL".split("");
    const row3 = ["ENTER", ..."ZXCVBNM".split(""), "BACKSPACE"];

    const activateKey = (key) => {
        setActiveKeys(prev => {
            const newSet = new Set(prev);
            newSet.add(key);
            return newSet;
        });

        setTimeout(() => {
            setActiveKeys(prev => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }, 150);
    };

    const handleClick = (key) => {
        const upperKey = key.toUpperCase();
        activateKey(upperKey);
        onKeyPress(upperKey);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            if (key === "BACKSPACE" || key === "ENTER" || /^[A-Z]$/.test(key)) {
                handleClick(key);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const getKeyClass = (key) => {
        const status = letterStatus[key];
        return `${status || ""} ${activeKeys.has(key) ? "active" : ""}`;
    };

    const renderKey = (key) => (
        <button
            key={key}
            className={`key ${["ENTER", "BACKSPACE"].includes(key) ? 'wide' : ''} ${getKeyClass(key)}`}
            onClick={() => handleClick(key)}
        >
            {key === 'BACKSPACE' ? '⌫' : key}
        </button>
    );

    return (
        <div className="keyboard">
            <div className="keyboard-row">{row1.map(renderKey)}</div>
            <div className="keyboard-row">{row2.map(renderKey)}</div>
            <div className="keyboard-row">{row3.map(renderKey)}</div>
        </div>
    );
}
