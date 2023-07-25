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
import {
  EditIcon,
  DeleteIcon,
  AddIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'
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
  itemsPerPage: number
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
  data = [],
  itemsPerPage,
}: AdminTableProps) {
  const [searchWord, setSearchWord] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, data.length)

  const filteredData = data
    .filter((item: any) =>
      get(item, searchFilterField).toLowerCase().includes(searchWord.toLowerCase()),
    )
    .slice(startIndex, endIndex)

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value)
    setCurrentPage(1)
  }

  const renderOrganisationRow = (data: any) => {
    return (
      <>
        {columns.map((column: AdminTableColumnProps) => (
          <Td key={column.field}>
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
            onChange={handleSearchChange}
          />
          <InputLeftElement width='4.5rem'>
            <SearchIcon />
          </InputLeftElement>
        </InputGroup>

        <TableContainer>
          <Table variant='striped'>
            <Thead>
              <Tr>
                {columns.map((column: AdminTableColumnProps) => (
                  <Th key={column.field}>{column.title}</Th>
                ))}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((item: any, idx: number) => (
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

        <Flex justify='space-between' mt={5}>
          <Button
            _hover={{
              backgroundColor: currentPage === 1 ? '#a5b3ca' : 'brand.primary',
              opacity: 1,
            }}
            onClick={handlePrevPage}
            leftIcon={<ChevronLeftIcon />}
            disabled={currentPage === 1}
          >
            Previous Page
          </Button>
          <Heading as='h5' size='sm'>
            Page {currentPage} of {totalPages}
          </Heading>
          <Button
            _hover={{
              backgroundColor: currentPage === totalPages ? '#a5b3ca' : 'brand.primary',
              opacity: 1,
            }}
            onClick={handleNextPage}
            rightIcon={<ChevronRightIcon />}
            disabled={currentPage === totalPages}
          >
            Next Page
          </Button>
        </Flex>
      </Box>
      <Footer />
    </Flex>
  )
}

export default AdminTable
