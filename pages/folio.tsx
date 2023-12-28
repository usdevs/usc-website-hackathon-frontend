import Footer from "../components/Footer";
import CreateButton from "../components/folio/CreateButton";
import ModuleScrolldown from "../components/folio/ModuleScrolldown";
import { NextPage } from "next";
import { Flex, Text } from "@chakra-ui/react";

const folio : NextPage = () => {
  return (
    <>
        <Flex direction='column' gap='15px' padding='15px'>
            <ModuleScrolldown title='Module Code'/>
            <ModuleScrolldown title='Module Number'/>
            <CreateButton/>
            <Text margin='15px'>Selected Module Code and Module Number</Text>
            <Text margin='15px'>ESSAY HERE</Text>
        </Flex>
        <Footer/>
    </>
  );
};

export default folio;