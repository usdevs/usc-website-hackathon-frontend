import { Card, CardHeader, CardBody, CardFooter, Text, Select } from '@chakra-ui/react'

const ModuleScrolldown = ({ title }: { title: string }) => {
    return (
        <Card>
            <CardHeader>
                <Text>{title}</Text>
            </CardHeader>
            <CardBody>
                <Select placeholder={`Select ${title}`}>
                    <option value='option1'>Option 1</option>
                    <option value='option2'>Option 2</option>
                    <option value='option3'>Option 3</option>
                </Select>
            </CardBody>
        </Card>
    );
}

export default ModuleScrolldown;