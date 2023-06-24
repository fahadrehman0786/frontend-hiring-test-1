import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Paper from '@mui/material/Paper'; // Add this line
import { useState, useEffect } from 'react';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CallDetailPage({open, setOpen, id, token}) {
  const [callData, setCallData] = useState();
  const [isLoading, setIsLoading] = useState(true);



  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        console.log(token+ "this is token");

        const meResponse = await axios.get(`https://frontend-test-api.aircall.io/calls/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setCallData(meResponse.data)
          setIsLoading(false);
          console.log(meResponse.data)

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar component={Paper} position="relative"> {/* Use component prop to specify Paper */}
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {isLoading || !token || !id ? (
          <div>Loading...</div>
        ) : (
          <List>
            <ListItem>
              <ListItemText primary="From" secondary={callData.from} />
            </ListItem>
            <ListItem>
              <ListItemText primary="To" secondary={callData.to} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Duration" secondary={callData.duration} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Archived Status"
                secondary={callData.is_archived ? "Archived" : "Not Archived"}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Via" secondary={callData.via} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Direction" secondary={callData.direction} />
            </ListItem>
          </List>
        )}
      </Dialog>
    </div>
  
  
  );
}
