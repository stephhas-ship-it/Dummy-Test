import React, { useState, useEffect, useCallback } from 'react';
import './Calculator.css';

const Calculator = () => {
    const [currentInput, setCurrentInput] = useState('');
    const [operatorClicked, setOperatorClicked] = useState(false);

    const displayValue = currentInput === '' ? '0' : currentInput;

    const appendNumber = useCallback((num) => {
        setOperatorClicked(false);
        setCurrentInput(prev => {
            if (prev === '0' && num !== '.') {
                return num;
            }
            return prev + num;
        });
    }, []);

    const appendOperator = useCallback((op) => {
        setCurrentInput(prev => {
            if (prev === '' && op === '-') return op;
            if (prev === '') return prev;
            if (/[+\-*/.]$/.test(prev)) {
                return prev.slice(0, -1) + op;
            }
            return prev + op;
        });
        setOperatorClicked(true);
    }, []);

    const clearDisplay = useCallback(() => {
        setCurrentInput('');
        setOperatorClicked(false);
    }, []);

    const backspace = useCallback(() => {
        setCurrentInput(prev => prev.toString().slice(0, -1));
    }, []);

    const calculate = useCallback(() => {
        if (currentInput === '' || /[+\-*/.]$/.test(currentInput)) return;

        try {
            const sanitizedInput = currentInput.replace(/[^0-9+\-*/.]/g, '');
            if (sanitizedInput) {
                // Using Function instead of eval
                const result = new Function('return ' + sanitizedInput)();
                let newRes = Math.round(result * 100000000) / 100000000;
                setCurrentInput(newRes.toString());
            }
        } catch (error) {
            setCurrentInput('Error');
            setTimeout(() => clearDisplay(), 1500);
        }
    }, [currentInput, clearDisplay]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
                appendNumber(e.key);
            } else if (['+', '-', '*', '/'].includes(e.key)) {
                appendOperator(e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                calculate();
            } else if (e.key === 'Backspace') {
                backspace();
            } else if (e.key === 'Escape') {
                clearDisplay();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [appendNumber, appendOperator, backspace, calculate, clearDisplay]);

    return (
        <div className="calculator-wrapper">
            <div className="color"></div>
            <div className="color"></div>
            <div className="color"></div>

            <div className="calculator">
                <div className="display">
                    <input type="text" readOnly placeholder="0" value={displayValue} />
                </div>
                <div className="buttons">
                    <div className="btn clear" onClick={clearDisplay}>C</div>
                    <div className="btn operator" onClick={() => appendOperator('/')}>÷</div>
                    <div className="btn operator" onClick={() => appendOperator('*')}>×</div>
                    <div className="btn operator" onClick={backspace}>⌫</div>

                    <div className="btn" onClick={() => appendNumber('7')}>7</div>
                    <div className="btn" onClick={() => appendNumber('8')}>8</div>
                    <div className="btn" onClick={() => appendNumber('9')}>9</div>
                    <div className="btn operator" onClick={() => appendOperator('-')}>-</div>

                    <div className="btn" onClick={() => appendNumber('4')}>4</div>
                    <div className="btn" onClick={() => appendNumber('5')}>5</div>
                    <div className="btn" onClick={() => appendNumber('6')}>6</div>
                    <div className="btn operator" onClick={() => appendOperator('+')}>+</div>

                    <div className="btn" onClick={() => appendNumber('1')}>1</div>
                    <div className="btn" onClick={() => appendNumber('2')}>2</div>
                    <div className="btn" onClick={() => appendNumber('3')}>3</div>
                    <div className="btn equal" onClick={calculate}>=</div>

                    <div className="btn zero" onClick={() => appendNumber('0')}>0</div>
                    <div className="btn" onClick={() => appendNumber('.')}>.</div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
