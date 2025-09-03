import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  SimpleGrid,
  HStack,
  VStack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useToast,
  Text
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import EmployeeCard from './EmployeeCard';

export interface Employee {
  id: number;
  name: string;
  role: string;
  isActive: boolean;
  salary: number;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    isActive: true,
    salary: 0,
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.role.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        await fetchEmployees();
        setNewEmployee({ name: '', role: '', isActive: true, salary: 0 });
        onClose();
        toast({
          title: 'Employee added successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const updateEmployee = async () => {
    if (!editingEmployee) return;

    try {
      const response = await fetch(`http://localhost:3000/employees/${editingEmployee.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingEmployee.name,
          role: editingEmployee.role,
          isActive: editingEmployee.isActive,
          salary: editingEmployee.salary,
        })
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === editingEmployee.id ? updatedEmployee : emp
          )
        );
        onClose();
        setEditingEmployee(null);
        toast({
          title: 'Employee updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEmployees();
        toast({
          title: 'Employee deleted successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleOpenAddDrawer = () => {
    setEditingEmployee(null);
    setNewEmployee({ name: '', role: '', isActive: true, salary: 0 });
    onOpen();
  };

  const handleOpenEditDrawer = (employee: Employee) => {
    setEditingEmployee(employee);
    onOpen();
  };

  const handleSave = () => {
    if (editingEmployee) {
      updateEmployee();
    } else {
      addEmployee();
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text fontSize="xl" textAlign="center">Loading...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header with title and toolbar */}
        <HStack justify="space-between" align="center">
          <Heading size="xl" color="brand.600">
            Employee Management
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            onClick={handleOpenAddDrawer}
            size="lg"
          >
            Add Employee
          </Button>
        </HStack>

        {/* Employees Grid */}
        {employees.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onDelete={deleteEmployee}
                onEdit={handleOpenEditDrawer}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              No employees to display
            </Text>
          </Box>
        )}
      </VStack>

      {/* Drawer for Add/Edit Employee */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Employee Name</FormLabel>
                <Input
                  value={editingEmployee ? editingEmployee.name : newEmployee.name}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, name: e.target.value });
                    } else {
                      setNewEmployee({ ...newEmployee, name: e.target.value });
                    }
                  }}
                  placeholder="Enter employee name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Input
                  value={editingEmployee ? editingEmployee.role : newEmployee.role}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, role: e.target.value });
                    } else {
                      setNewEmployee({ ...newEmployee, role: e.target.value });
                    }
                  }}
                  placeholder="Enter role"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Salary</FormLabel>
                <Input
                  value={editingEmployee ? editingEmployee.salary : newEmployee.salary}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, salary: Number(e.target.value) });
                    } else {
                      setNewEmployee({ ...newEmployee, salary: Number(e.target.value) });
                    }
                  }}
                  placeholder="Enter salary"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="active-status" mb="0">
                  Active Employee
                </FormLabel>
                <Switch
                  id="active-status"
                  isChecked={editingEmployee ? editingEmployee.isActive : newEmployee.isActive}
                  onChange={(e) => {
                    if (editingEmployee) {
                      setEditingEmployee({ ...editingEmployee, isActive: e.target.checked });
                    } else {
                      setNewEmployee({ ...newEmployee, isActive: e.target.checked });
                    }
                  }}
                />
              </FormControl>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <HStack spacing={3}>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSave}>
                {editingEmployee ? 'Update' : 'Add'}
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  );
}
export default App;