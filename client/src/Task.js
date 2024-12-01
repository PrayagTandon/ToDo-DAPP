import { List, ListItem, ListItemText } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import './Task.css';

const Task = ({ taskText, importance, onClick }) => {
    // Determine background color based on importance
    const getBackgroundColor = () => {
        switch (importance) {
            case 0: // Low
                return 'bg-green-500';
            case 1: // Medium
                return 'bg-yellow-500';
            case 2: // High
                return 'bg-red-500';
            default:
                return 'bg-gray-500'; // Fallback color
        }
    };

    return (
        <List className={`todo__list ${getBackgroundColor()} rounded-lg shadow-md p-3 mb-3`}>
            <ListItem>
                <ListItemText primary={taskText} />
            </ListItem>
            <DeleteTwoToneIcon
                fontSize="medium"
                color="error"
                className="cursor-pointer"
                onClick={onClick}
            />
        </List>
    );
};

export default Task;
