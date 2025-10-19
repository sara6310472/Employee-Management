import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Container, Heading, Button, SimpleGrid, HStack, VStack, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, FormControl, FormLabel, Input, Switch, useToast, Text, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EmployeeCard from './EmployeeCard';
const fetchEmployees = async () => {
    const response = await fetch('/api/employees');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};
const addEmployeeApi = async (employee) => {
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
const updateEmployeeApi = async (employee) => {
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
const deleteEmployeeApi = async (id) => {
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
    const [editingEmployee, setEditingEmployee] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const queryClient = useQueryClient();
    const { data: employees = [], isLoading, isError, error, refetch } = useQuery({
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
    const handleOpenEditDrawer = (employee) => {
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
        }
        else {
            addEmployeeMutation.mutate(newEmployee);
        }
    };
    const handleDelete = (id) => {
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
        return (_jsx(Container, { maxW: "container.xl", py: 8, children: _jsxs(VStack, { spacing: 4, children: [_jsx(Spinner, { size: "xl", color: "brand.500", thickness: "4px" }), _jsx(Text, { fontSize: "xl", color: "gray.600", children: "Loading employees..." })] }) }));
    }
    // Error state
    if (isError) {
        return (_jsx(Container, { maxW: "container.xl", py: 8, children: _jsxs(Alert, { status: "error", borderRadius: "lg", children: [_jsx(AlertIcon, {}), _jsxs(Box, { children: [_jsx(AlertTitle, { children: "Failed to load employees!" }), _jsx(AlertDescription, { children: error instanceof Error ? error.message : 'An unknown error occurred' })] }), _jsx(Button, { ml: "auto", colorScheme: "red", variant: "outline", onClick: handleRefresh, leftIcon: _jsx(RepeatIcon, {}), isLoading: isLoading, children: "Try Again" })] }) }));
    }
    return (_jsxs(Container, { maxW: "container.xl", py: 8, children: [_jsxs(VStack, { spacing: 8, align: "stretch", children: [_jsxs(HStack, { justify: "space-between", align: "center", children: [_jsx(Heading, { size: "xl", color: "brand.600", children: "Employee Management" }), _jsxs(HStack, { spacing: 3, children: [_jsx(Button, { leftIcon: _jsx(RepeatIcon, {}), variant: "outline", colorScheme: "brand", onClick: handleRefresh, isLoading: isLoading, loadingText: "Refreshing...", size: "lg", children: "Refresh" }), _jsx(Button, { leftIcon: _jsx(AddIcon, {}), colorScheme: "brand", onClick: handleOpenAddDrawer, size: "lg", children: "Add Employee" })] })] }), employees.length > 0 ? (_jsx(SimpleGrid, { columns: { base: 1, md: 2, lg: 3 }, spacing: 6, children: employees.map((employee) => (_jsx(EmployeeCard, { employee: employee, onDelete: handleDelete, onEdit: handleOpenEditDrawer }, employee.id))) })) : (_jsx(Box, { textAlign: "center", py: 12, children: _jsx(Text, { fontSize: "lg", color: "gray.500", children: "No employees to display" }) }))] }), _jsxs(Drawer, { isOpen: isOpen, placement: "right", onClose: onClose, size: "md", children: [_jsx(DrawerOverlay, {}), _jsxs(DrawerContent, { children: [_jsx(DrawerCloseButton, {}), _jsx(DrawerHeader, { children: editingEmployee ? 'Edit Employee' : 'Add New Employee' }), _jsx(DrawerBody, { children: _jsxs(VStack, { spacing: 6, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Employee Name" }), _jsx(Input, { value: editingEmployee ? editingEmployee.name : newEmployee.name, onChange: (e) => {
                                                        if (editingEmployee) {
                                                            setEditingEmployee({ ...editingEmployee, name: e.target.value });
                                                        }
                                                        else {
                                                            setNewEmployee({ ...newEmployee, name: e.target.value });
                                                        }
                                                    }, placeholder: "Enter employee name" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Role" }), _jsx(Input, { value: editingEmployee ? editingEmployee.role : newEmployee.role, onChange: (e) => {
                                                        if (editingEmployee) {
                                                            setEditingEmployee({ ...editingEmployee, role: e.target.value });
                                                        }
                                                        else {
                                                            setNewEmployee({ ...newEmployee, role: e.target.value });
                                                        }
                                                    }, placeholder: "Enter role" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Salary" }), _jsx(Input, { type: "number", value: editingEmployee ? editingEmployee.salary : newEmployee.salary, onChange: (e) => {
                                                        if (editingEmployee) {
                                                            setEditingEmployee({ ...editingEmployee, salary: Number(e.target.value) });
                                                        }
                                                        else {
                                                            setNewEmployee({ ...newEmployee, salary: Number(e.target.value) });
                                                        }
                                                    }, placeholder: "Enter salary" })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { htmlFor: "active-status", mb: "0", children: "Active Employee" }), _jsx(Switch, { id: "active-status", isChecked: editingEmployee ? editingEmployee.isActive : newEmployee.isActive, onChange: (e) => {
                                                        if (editingEmployee) {
                                                            setEditingEmployee({ ...editingEmployee, isActive: e.target.checked });
                                                        }
                                                        else {
                                                            setNewEmployee({ ...newEmployee, isActive: e.target.checked });
                                                        }
                                                    } })] })] }) }), _jsx(DrawerFooter, { children: _jsxs(HStack, { spacing: 3, children: [_jsx(Button, { variant: "outline", mr: 3, onClick: onClose, children: "Cancel" }), _jsx(Button, { colorScheme: "brand", onClick: handleSave, isLoading: addEmployeeMutation.isPending || updateEmployeeMutation.isPending, loadingText: editingEmployee ? 'Updating...' : 'Adding...', children: editingEmployee ? 'Update' : 'Add' })] }) })] })] })] }));
}
export default App;
