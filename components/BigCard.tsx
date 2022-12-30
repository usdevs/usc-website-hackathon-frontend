import React from "react";
import { LinkBox, LinkOverlay, Text } from "@chakra-ui/react";

const BigCard: React.FC<ButtonInfo> = (props) => {
  return (
      <LinkBox
          as='button'
          //todo justify to left
          // justifyContent="left"
          // alignItems="flex-start"
          // alignContent={"flex-start"}
          // justifyItems={"flex-start"}
          transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
          height={'50vh'}
          // lineHeight={'16'}
          borderRadius='140px'
          fontSize='40px'
          fontFamily={'Domine'}
          bg='#d9d9d9'
          _hover={{ bg: '#ebedf0' }}
          _active={{
            bg: '#dddfe2',
            transform: 'scale(0.98)',
            borderColor: '#bec3c9',
          }}
          _focus={{
            boxShadow:
                '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
          }}
      >
          <Text>{props.name}</Text>
        <LinkOverlay href={props.link}/>
      </LinkBox>  );
};

export default BigCard;
