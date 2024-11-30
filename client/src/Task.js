import { List, ListItem, ListItemText } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import './Task.css';

const Task = ({ taskText, importance, onClick }) => {
    const getBackgroundColor = () => {
        switch (importance) {
            case 'High':
                return 'bg-red-300';
            case 'Medium':
                return 'bg-yellow-300';
            default:
                return 'bg-green-300';
        }
    };

    return (
        <List className={`todo__list ${getBackgroundColor()} rounded-lg shadow-md p-2`}>
            <ListItem>
                <ListItemText primary={taskText} />
            </ListItem>
            <DeleteTwoToneIcon fontSize="medium" color="error" className="cursor-pointer" onClick={onClick} />
        </List>
    );
};

export default Task;
