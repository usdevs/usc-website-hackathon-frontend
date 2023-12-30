import React from 'react';
import { Card, Textarea } from '@chakra-ui/react';


interface ShortAnswerCardProps {
    label: string;
    prompt: string;
}

const ShortAnswerCard: React.FC<ShortAnswerCardProps> = ({ label, prompt }) => {
    return (
        <Card 
        display="flex" 
        alignItems="center" 
        p={4} mb={4}
        size='md'
        direction={{ base: 'column', lg: 'row' }}
        overflow='hidden'
        variant='outline'
        width='70%'
        bg='AliceBlue'
        >
            <label style={{ width: '200px' }}>{label + ": "}</label>
            <Textarea placeholder={prompt} size='md' variant='outline' bg='white' style={{ flex: 1 }} /> 
        </Card>
    );
};

export default ShortAnswerCard;