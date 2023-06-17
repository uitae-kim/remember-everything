import Papa from 'papaparse';
import {useEffect, useRef, useState} from "react";
import './Remeber.css';

export default function Remember() {
    const container = useRef();
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [tries, setTries] = useState(0);

    const parseCSVFile = (filePath) => {
        fetch(filePath)
            .then((response) => response.text())
            .then((csvData) => {
                const parsedData = Papa.parse(csvData, { header: true });
                // Access the parsed CSV data here
                setData(parsedData.data.filter(item => item['단어'] !== ''));
                setLoaded(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const selectQuestion = () => {
        function getRandomElementsFromArray(array, n) {
            if (n >= array.length) {
                return array.slice();
            }

            const selectedElements = [];

            while (selectedElements.length < n) {
                const randomIndex = Math.floor(Math.random() * array.length);
                if (!selectedElements.includes(array[randomIndex])) {
                    selectedElements.push(array[randomIndex]);
                }
            }

            return selectedElements;
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        const selected = getRandomElementsFromArray(data, 4);
        setQuestion(selected[0]['뜻']);
        setAnswer(selected[0]['단어']);
        setAnswers(shuffleArray(selected.map(item => item['단어'])));
    };

    const handleAnswer = (correct) => {
        const className = correct ? 'correct' : 'wrong';

        if (container.current) {
            container.current.classList.remove('normal');
            container.current.classList.remove('correct');
            container.current.classList.remove('wrong');
            container.current.classList.add('normal');
            setTimeout(() => {
                container.current.classList.remove('normal');
                container.current.classList.remove('correct');
                container.current.classList.remove('wrong');
                container.current.classList.add(className);
            }, 0.0001);
        }

        setScore(score => correct ? score + 1 : score);
        setTries(tries => tries + 1);
        selectQuestion();
    };

    useEffect(() => {
        parseCSVFile('./data.csv');
    }, []);

    useEffect(() => {
        if (loaded) {
            selectQuestion();
        }
    }, [loaded]);

    return (
        <div ref={container} className={'normal'} style={{height: '100%'}}>
            <div>
                <p style={{fontWeight: 700}}>점수: {score}/{tries}</p>
            </div>
            {question &&
                <div>
                    <p style={{fontWeight: 700}}>뜻</p>
                    <p>{question}</p>
                    <div><p style={{fontWeight: 700}}>단어 보기</p></div>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>
                        {answers.map(item => <p key={item} style={{cursor: 'pointer'}} onClick={() => {
                            handleAnswer(item === answer);
                        }}>{item}</p>)}
                    </div>
                </div>
            }
        </div>
    )
}