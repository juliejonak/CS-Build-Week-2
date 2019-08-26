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
        margin-top: 15%;
    }

    @media (min-width: 800px) {
        margin-top: 5%;
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
    }

`

export const Background = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`