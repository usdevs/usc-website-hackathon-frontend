import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const CreateButton = () => {
    return (
        <Button leftIcon={<AddIcon />} colorScheme="blue">Create</Button>
    );
}

export default CreateButton;