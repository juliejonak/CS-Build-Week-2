import styled from 'styled-components';

export const Button = styled.div`
    display: flex;
    align-items: center;
    background: #1b3f87;
    height: 8vh;
    width: 20%;
    border-radius: 22px;
    color: white;
    font-weight: bold;
    font-size: 1.1em;
    justify-content: space-evenly;
    max-width: 300px;
    min-width: 220px;
    
    &:hover {
        box-shadow: 3px 3px 15px rgba(11, 34, 81, 0.4);
    }

    @media (max-width: 699px) {
        height: 8vh;
        width: 25%;
        font-size: 1.1em;
        margin-bottom: 7%;
    }

    @media (min-width: 700px) {
        margin-bottom: 9%;
    }

    @media (min-width: 1000px) {
        margin-bottom: 0;
    }
`

export const ButtonBox = styled.div`
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    justify-content: space-evenly;

    @media (max-width: 699px) {
        flex-direction: column;
        align-items: center;
    }

    @media (max-width: 999px){
        flex-direciton: row;
        flex-wrap: wrap;
        flex-grow: 2;
        width: 65%;
        margin-top: 2%;
    }

    @media (min-width: 800px) {
        margin-bottom: -5%;
    }

    @media (min-width: 1000px) {
        flex-direction: row;
        flex-wrap: wrap;
        width: 90%
        margin-top: 2%;
        margin-bottom: 0;
    }
`

export const Background = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    

    @media (max-width: 699px) {
        margin-bottom: 5%;
        margin-top: 1%;
    }

    @media (min-width: 800px) {
        margin-bottom: 5%;
        margin-top: 3%;
    }

    h1 {
        font-size: 3em;
        margin-top: 2em;
        color: #102650;
        font-weight: bold;

        @media (max-width: 799px) {
            font-size: 2em;
            margin-top: 1.5em;
        }
    }
`

export const TextScreen = styled.div`
    width: 80%;
    height: 20vh;
    background-color: black;
    color: green;
    margin: 0 auto;
    padding: 3%;
    text-align: left;
    overflow: auto;
    font-weight: bold;
    white-space: pre-line;
    background-color: #89DBCA;
    color: #1b3f87;

    @media (max-width: 699px) {
        width: 70%;
        height: 100%;
        padding: 5%;
    }

    @media (max-width: 999px) {
        min-height: 30vh;
    }

    @media (min-width: 1000px) {
        min-height: 40vh;
    }
`