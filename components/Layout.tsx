import { Flex } from "@chakra-ui/react";
import { ReactNode } from 'react'; 
import Header from './Header';

interface Props {
    children?:ReactNode
}

export default function Layout({ children }: Props) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}