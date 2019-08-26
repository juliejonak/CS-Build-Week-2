import React from 'react';
import { Button, ButtonBox, Background } from '../customComponents/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap, faStore, faCoins, faGem } from '@fortawesome/free-solid-svg-icons'

const ButtonBar = () => {
    return(
        <Background>
            <h1>Lambda Treasure Hunt</h1>
            <ButtonBox>
                <Button style={{marginTop: '0%'}}>
                    <p>Explore</p>
                    <FontAwesomeIcon icon={faMap} />
                </Button>
                <Button>
                    <p>Pirate Ry's Store</p>
                    <FontAwesomeIcon icon={faStore} />
                </Button>
                <Button>
                    <p>Find Treasure</p>
                    <FontAwesomeIcon icon={faGem} />
                </Button>
                <Button>
                    <p>Mine Coin</p>
                    <FontAwesomeIcon icon={faCoins} />
                </Button>
            </ButtonBox>
        </Background>
    )
}

export default ButtonBar;