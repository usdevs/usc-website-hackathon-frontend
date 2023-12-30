import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Link from "next/link";

const CreateButton = () => {
    return (
        <Link href="/folio/create">
            <Button leftIcon={<AddIcon />} colorScheme="blue">Create</Button>
        </Link>
    );
}

export default CreateButton;