import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardBody, Text, Badge, HStack, VStack, IconButton, Avatar, Box, Divider } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState } from 'react';
function EmployeeCard({ employee, onDelete, onEdit }) {
    const [isOpen, setIsOpen] = useState(false);
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    return (_jsx(Card, { variant: "elevated", shadow: "md", _hover: { shadow: "lg", transform: "translateY(-2px)" }, transition: "all 0.2s", children: _jsx(CardBody, { children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(HStack, { justify: "space-between", align: "center", children: [_jsxs(HStack, { spacing: 3, children: [_jsx(Avatar, { size: "md", name: employee.name, getInitials: getInitials, bg: "brand.500", color: "white" }), _jsxs(VStack, { align: "start", spacing: 0, children: [_jsx(Text, { fontWeight: "bold", fontSize: "lg", children: employee.name }), _jsxs(Text, { fontSize: "sm", color: "gray.600", children: ["ID: ", employee.id] })] })] }), _jsx(Badge, { colorScheme: employee.isActive ? 'green' : 'red', variant: "solid", borderRadius: "full", px: 3, py: 1, children: employee.isActive ? 'Active' : 'Inactive' })] }), _jsxs(Box, { children: [_jsxs(HStack, { justify: "space-between", align: "center", mb: 2, children: [_jsx(Text, { fontSize: "sm", color: "gray.600", fontWeight: "medium", children: "Details" }), _jsx(IconButton, { "aria-label": "Toggle details", icon: isOpen ? _jsx(ChevronUpIcon, {}) : _jsx(ChevronDownIcon, {}), size: "sm", variant: "ghost", onClick: () => setIsOpen(!isOpen) })] }), isOpen && (_jsxs(Box, { pt: 2, animation: "fadeIn 0.2s ease-in", css: {
                                    '@keyframes fadeIn': {
                                        from: { opacity: 0, maxHeight: 0 },
                                        to: { opacity: 1, maxHeight: '500px' },
                                    },
                                }, children: [_jsx(Divider, { mb: 3 }), _jsxs(VStack, { align: "stretch", spacing: 2, children: [_jsxs(HStack, { justify: "space-between", children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Role:" }), _jsx(Text, { fontSize: "sm", fontWeight: "medium", children: employee.role })] }), _jsxs(HStack, { justify: "space-between", children: [_jsx(Text, { fontSize: "sm", color: "gray.600", children: "Salary:" }), _jsxs(Text, { fontSize: "sm", fontWeight: "medium", children: ["$", employee.salary] })] })] })] }))] }), _jsxs(HStack, { justify: "center", spacing: 3, pt: 2, children: [_jsx(IconButton, { "aria-label": "Edit employee", icon: _jsx(EditIcon, {}), colorScheme: "blue", variant: "outline", size: "sm", onClick: () => onEdit(employee) }), _jsx(IconButton, { "aria-label": "Delete employee", icon: _jsx(DeleteIcon, {}), colorScheme: "red", variant: "outline", size: "sm", onClick: () => onDelete(employee.id) })] })] }) }) }));
}
export default EmployeeCard;
