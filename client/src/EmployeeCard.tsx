import {
    Card,
    CardBody,
    Text,
    Badge,
    HStack,
    VStack,
    IconButton,
    Avatar,
    Box,
    Divider,
    Button
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import type { Employee } from './App';

interface EmployeeCardProps {
    employee: Employee;
    onDelete: (id: number) => void;
    onEdit: (employee: Employee) => void;
}

function EmployeeCard({ employee, onDelete, onEdit }: EmployeeCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card
            variant="elevated"
            shadow="md"
            _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
            transition="all 0.2s"
        >
            <CardBody>
                <VStack spacing={4} align="stretch">
                    {/* Header with Avatar and Status */}
                    <HStack justify="space-between" align="center">
                        <HStack spacing={3}>
                            <Avatar
                                size="md"
                                name={employee.name}
                                getInitials={getInitials}
                                bg="brand.500"
                                color="white"
                            />
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="bold" fontSize="lg">
                                    {employee.name}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    ID: {employee.id}
                                </Text>
                            </VStack>
                        </HStack>
                        <Badge
                            colorScheme={employee.isActive ? 'green' : 'red'}
                            variant="solid"
                            borderRadius="full"
                            px={3}
                            py={1}
                        >
                            {employee.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </HStack>

                    {/* Collapsible Content - Using Simple State */}
                    <Box>
                        <HStack justify="space-between" align="center" mb={2}>
                            <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                Details
                            </Text>
                            <IconButton
                                aria-label="Toggle details"
                                icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsOpen(!isOpen)}
                            />
                        </HStack>

                        {/* Conditional Rendering Instead of Collapse */}
                        {isOpen && (
                            <Box
                                pt={2}
                                animation="fadeIn 0.2s ease-in"
                                css={{
                                    '@keyframes fadeIn': {
                                        from: { opacity: 0, maxHeight: 0 },
                                        to: { opacity: 1, maxHeight: '500px' },
                                    },
                                }}
                            >
                                <Divider mb={3} />
                                <VStack align="stretch" spacing={2}>
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" color="gray.600">Role:</Text>
                                        <Text fontSize="sm" fontWeight="medium">{employee.role}</Text>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" color="gray.600">Salary:</Text>
                                        <Text fontSize="sm" fontWeight="medium">
                                            ${employee.salary}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Box>
                        )}
                    </Box>

                    {/* Action Buttons */}
                    <HStack justify="center" spacing={3} pt={2}>
                        <IconButton
                            aria-label="Edit employee"
                            icon={<EditIcon />}
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(employee)}
                        />
                        <IconButton
                            aria-label="Delete employee"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(employee.id)}
                        />
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}

export default EmployeeCard;