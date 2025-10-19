import { useState } from 'react';
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
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EmployeeCard from './EmployeeCard';

export interface Employee {
  id: number;
  name: string;
  role: string;
  isActive: boolean;
  salary: number;
}

const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await fetch('/api/employees');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const addEmployeeApi = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const response = await fetch('/api/employees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const updateEmployeeApi = async (employee: Employee): Promise<Employee> => {
  const response = await fetch(`/api/employees/${employee.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: employee.name,
      role: employee.role,
      isActive: employee.isActive,
      salary: employee.salary,
    })
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const deleteEmployeeApi = async (id: number): Promise<void> => {
  const response = await fetch(`/api/employees/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

function App() {
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    isActive: true,
    salary: 0,
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: employees = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const addEmployeeMutation = useMutation({
    mutationFn: addEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setNewEmployee({ name: '', role: '', isActive: true, salary: 0 });
      onClose();
      toast({
        title: 'Employee added successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: () => {
      toast({
        title: 'Error adding employee',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: updateEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      onClose();
      setEditingEmployee(null);
      toast({
        title: 'Employee updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: () => {
      toast({
        title: 'Error updating employee',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployeeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Employee deleted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: () => {
      toast({
        title: 'Error deleting employee',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  });

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
    if (!newEmployee.name.trim() || !newEmployee.role.trim()) {
      toast({
        title: 'Please fill all required fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (editingEmployee) {
      updateEmployeeMutation.mutate(editingEmployee);
    } else {
      addEmployeeMutation.mutate(newEmployee);
    }
  };

  const handleDelete = (id: number) => {
    deleteEmployeeMutation.mutate(id);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Refreshing data...',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text fontSize="xl" color="gray.600">Loading employees...</Text>
        </VStack>
      </Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Failed to load employees!</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </AlertDescription>
          </Box>
          <Button
            ml="auto"
            colorScheme="red"
            variant="outline"
            onClick={handleRefresh}
            leftIcon={<RepeatIcon />}
            isLoading={isLoading}
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="xl" color="brand.600">
            Employee Management
          </Heading>
          <HStack spacing={3}>
            <Button
              leftIcon={<RepeatIcon />}
              variant="outline"
              colorScheme="brand"
              onClick={handleRefresh}
              isLoading={isLoading}
              loadingText="Refreshing..."
              size="lg"
            >
              Refresh
            </Button>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="brand"
              onClick={handleOpenAddDrawer}
              size="lg"
            >
              Add Employee
            </Button>
          </HStack>
        </HStack>

        {employees.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onDelete={handleDelete}
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
                  type="number"
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
              <Button
                colorScheme="brand"
                onClick={handleSave}
                isLoading={addEmployeeMutation.isPending || updateEmployeeMutation.isPending}
                loadingText={editingEmployee ? 'Updating...' : 'Adding...'}
              >
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