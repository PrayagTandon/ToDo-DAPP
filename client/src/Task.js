import { List, ListItem, ListItemText } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import './Task.css';

const Task = ({ taskText, importance, onClick }) => {
    const getBackgroundColor = () => {
        switch (importance) {
            case 'High':
                return 'bg-red-500';
            case 'Medium':
                return 'bg-yellow-500';
            default:
                return 'bg-green-500';
        }
    };

    return (
        <List className={`todo__list ${getBackgroundColor()}`} >
            <ListItem>
                <ListItemText primary={taskText} />
            </ListItem>
            <DeleteTwoToneIcon fontSize="medium" color="error" className="cursor-pointer" onClick={onClick} />
        </List>
    );
};

export default Task;

// ${getBackgroundColor()} rounded-lg shadow-md p-2