import { useTheme } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
export default function Navbar() {
    const theme = useTheme();
    return (
        <Box backgroundColor={theme.colors.primary.main} color={'white'}>
            Nav content
        </Box>
    )
}