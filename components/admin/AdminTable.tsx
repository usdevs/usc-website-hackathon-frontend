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

export interface AdminTableColumnProps {
  title: string
  field: string
  fieldToText?: (value: any) => string
}

type AdminTableProps = {
  columns: AdminTableColumnProps[]
  searchFilterField: string
  headerText: string
  addButtonText: string
  searchFieldText: string
  data: any[] | undefined
  onAdd: () => void
  onEdit: (rowData: any) => void
  onDelete: (rowData: any) => void
}

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
}: AdminTableProps) {
  const [searchWord, setSearchWord] = useState('')

  const renderOrganisationRow = (data: any) => {
    return (
      <>
        {columns.map((column: any, index) => (
          <Td key={index}>
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
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
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
              {data
                ?.filter((item: any) =>
                  get(item, searchFilterField).toLowerCase().includes(searchWord.toLowerCase()),
                )
                .map((item: any, idx: number) => (
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
