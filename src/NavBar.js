import React from 'react';
import { Box, Button, Flex, Image, Link, Spacer } from '@chakra-ui/react';
import Email from "./assets/social-media-icons/email_32x32.png";
import Linkedin from "./assets/social-media-icons/linkedin.svg";
import Discord from "./assets/social-media-icons/discord.svg";
import Telegram from "./assets/social-media-icons/telegram.svg";
import Twitter from "./assets/social-media-icons/twitter.svg";
import Instagram from "./assets/social-media-icons/instagram.svg";
import Facebook from "./assets/social-media-icons/facebook.svg";
import Youtube from "./assets/social-media-icons/youtube.svg";



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
        
        <Flex justify="center" align="center" padding="1px" marginTop="120px">
        
            {/*Left Side - Social Media Icons*/}
            <Flex justify="center" align='center' width="40%" padding="1px">
                <Link href="https://www.linkedin.com/company/brais-games/?originalSubdomain=br">
                    <Image src={Linkedin} width="33px" height="24px" marginLeft="15px" marginRight="15px"/>
                </Link>
                <Link href="https://discord.com/">
                    <Image src={Discord} width="33px" height="24px" marginLeft="15px" marginRight="15px"/>
                </Link>
                <Link href="https://telegram.com/">
                    <Image src={Telegram} width="33px" height="24px"marginLeft="15px" marginRight="15px"/>
                </Link>
                <Link href="https://twitter.com/trixbtgame">
                    <Image src={Twitter} width="33px" height="24px" marginLeft="15px" marginRight="15px"/>
                </Link>
                <Link href="https://www.instagram.com/trixbtgame">
                    <Image src={Instagram} width="33px" height="24px" marginLeft="15px" marginRight="15px"/>
                </Link>
                <Link href="https://www.facebook.com/">
                    <Image src={Facebook} width="33px" height="24px" marginLeft="15px" marginRight="15px"/>
                </Link>
                <Link href="https://www.youtube.com/channel/UCeDkcq0R-wPezFKLh06z2mA">
                    <Image src={Youtube} width="33px" height="24px" marginLeft="15px" marginRight="15px"/>
                </Link>

            </Flex>
</Flex>


    );
};

export default NavBar;