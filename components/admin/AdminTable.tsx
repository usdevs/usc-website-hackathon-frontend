import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  InputLeftElement,
  InputGroup,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, AddIcon, SearchIcon } from '@chakra-ui/icons'
import Footer from '../Footer'
import { useState } from 'react'
import get from 'lodash/get'

function AdminTable({
  columns,
  searchFilterField,
  headerText,
  onAdd,
  onEdit,
  onDelete,
  addButtonText,
  searchFieldText,
  data,
}: any) {
  const [displayedData, setDisplayedData] = useState(data)

  const renderOrganisationRow = (data: any) => {
    return (
      <>
        {columns.map((column: any) => (
          <Td>
            {column.fieldToText
              ? column.fieldToText(get(data, column.field))
              : get(data, column.field)}
          </Td>
        ))}
      </>
    )
  }

  return (
    <Flex justify='center' flexDir='column' as='main'>
      <Box p='3rem'>
        <Flex justify='space-between' alignItems='center' mb={50}>
          <Heading as='h1' size='lg'>
            {headerText}
          </Heading>
          <Button leftIcon={<AddIcon />} colorScheme='teal' variant='solid' onClick={onAdd}>
            {addButtonText}
          </Button>
        </Flex>
        <InputGroup mb={25}>
          <Input
            pl='4.5rem'
            type='text'
            placeholder={searchFieldText}
            onChange={(e) =>
              setDisplayedData(
                data.filter((item: any) =>
                  get(item, searchFilterField).toLowerCase().includes(e.target.value.toLowerCase()),
                ),
              )
            }
          />
          <InputLeftElement width='4.5rem'>
            <SearchIcon />
          </InputLeftElement>
        </InputGroup>

        <TableContainer>
          <Table variant='striped'>
            <Thead>
              <Tr>
                {columns.map((column: any) => (
                  <Th key={column.field}>{column.title}</Th>
                ))}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayedData?.map((item: any, idx: number) => (
                <Tr key={idx}>
                  {renderOrganisationRow(item)}
                  <Td>
                    <Button
                      onClick={() => onEdit(item)}
                      leftIcon={<EditIcon />}
                      colorScheme='blue'
                      variant='outline'
                      mr={5}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDelete(item)}
                      leftIcon={<DeleteIcon />}
                      colorScheme='red'
                      variant='solid'
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Footer />
    </Flex>
  )
}

export default AdminTable
