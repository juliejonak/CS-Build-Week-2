import styled from 'styled-components';

export const Button = styled.div`
    display: flex;
    align-items: center;
    background: #1b3f87;
    height: 10vh;
    width: 40%;
    border-radius: 22px;
    color: white;
    font-weight: bold;
    font-size: 1.3em;
    justify-content: space-evenly;
    max-width: 300px;
    min-width: 220px;
    
    &:hover {
        box-shadow: 3px 3px 15px rgba(11, 34, 81, 0.4);
    }

    @media (max-width: 799px) {
        margin-top: 10%;
        height: 8vh;
        width: 25%;
        font-size: 1.1em;
    }

    @media (min-width: 800px) {
        margin-bottom: 5%;
    }
`

export const ButtonBox = styled.div`
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    justify-content: space-evenly;

    @media (max-width: 799px) {
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: 800px) {
        flex-direction: row;
        flex-wrap: wrap;
        flex-grow: 2;
        margin-top: 3%;
        margin-bottom: -4%;
    }
`

export const Background = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    

    @media (max-width: 799px) {
        margin-bottom: 5%;
        margin-top: 1%;
    }

    @media (min-width: 800px) {
        margin-bottom: 5%;
        margin-top: 3%;
    }
`

export const TextScreen = styled.div`
    width: 80%;
    height: 20vh;
    background-color: black;
    color: green;
    margin: 0 auto;
    padding: 5%;
    text-align: left;
    overflow: auto;
    font-weight: bold;
    white-space: pre-line;

    @media (max-width: 799px) {
        width: 70%;
        height: 100%;
    }
`