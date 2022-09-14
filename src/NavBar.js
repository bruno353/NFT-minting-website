import React from 'react';
import { Box, Button, Flex, Image, Link, Spacer } from '@chakra-ui/react';
import Facebook from "./assets/social-media-icons/facebook_32x32.png";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Email from "./assets/social-media-icons/email_32x32.png";

const NavBar = ({accounts, setAccounts}) => {
    const isConnected = Boolean(accounts[0]);

    async function connectAccount(){
        if(window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
        setAccounts(accounts);
        }
    }

    return(
        
        <Flex justify="center" align="center" padding="1px">
        
            {/*Left Side - Social Media Icons*/}
            <Flex justify="center" align='center' width="40%" padding="1px">
                <Link href="https://www.facebook.com">
                    <Image src={Facebook} boxSize="42px"/>
                </Link>
                <Link href="https://www.twitter.com">
                    <Image src={Twitter} boxSize="42px"/>
                </Link>
                <Link href="https://www.gmail.com">
                    <Image src={Email} boxSize="42px"/>
                </Link>
            </Flex>
</Flex>


    );
};

export default NavBar;