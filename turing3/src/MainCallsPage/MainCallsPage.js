import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Stack from "@mui/material/Stack";


import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";


import CallDetailPage from "../CallDetailPage/CallDetailPage";

const MainCallsPage = () => {
  const [data, setData] = useState(null);
  const [token, setToken] = useState();
  const [archivedCalls, setArchivedCalls] = useState([]);
  const [grouped, setGrouped] = useState(false);
  const [notes, setNotes] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [currentCallId, setCurrentCallId] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentCallIdForDetail, setCurrentCallIdForDetail] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterBy, setFilterBy] = useState("all"); 
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginResponse = await axios.post(
          "https://frontend-test-api.aircall.io/auth/login",
          { username: "fahad", password: "test123" }
        );

        setToken(loginResponse.data.access_token);

        const meResponse = await axios.get(
          "https://frontend-test-api.aircall.io/calls",
          {
            headers: {
              Authorization: `Bearer ${loginResponse.data.access_token}`,
            },
          }
        );
        

        const responseData = meResponse.data;
        setData(responseData.nodes);
        console.log(responseData.nodes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleCallItemClick = async (call) => {
    console.log("This is tok " + token);

    console.log("Clicked call:", call);
    const meResponse = await axios.get(
      `https://frontend-test-api.aircall.io/calls/${call.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(meResponse);
  };

  const handleArchiveCall = async (call) => {
    try {
      const response = await axios.put(
        `https://frontend-test-api.aircall.io/calls/${call.id}/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the archived status of the call
      const updatedCall = { ...call, is_archived: true };

      // Find the index of the call in the data array
      const callIndex = data.findIndex((c) => c.id === call.id);

      // Create a new data array with the updated call
      const updatedData = [...data];
      updatedData[callIndex] = updatedCall;

      // Update the state variables
      setData(updatedData);
      setArchivedCalls((prevArchivedCalls) => [
        ...prevArchivedCalls,
        updatedCall,
      ]);

      console.log("Archive call response:", response.data);
    } catch (error) {
      console.error("Error archiving call:", error.message);
    }
  };

  const handleAddNote = (callId) => {
    setCurrentCallId(callId);
    setNoteContent("");
    setNotes((prevNotes) => ({
      ...prevNotes,
      [callId]: {},
    }));
    setDialogOpen(true);
  };

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };

  const handleSubmitNote = async () => {
    const callId = currentCallId;
    try {
      const response = await axios.post(
        `https://frontend-test-api.aircall.io/calls/${callId}/note`,
        {
          content: noteContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear the note textarea and hide it
      setNotes((prevNotes) => ({
        ...prevNotes,
        [callId]: {
          showTextArea: false,
          content: "",
        },
      }));

      setDialogOpen(false);

      console.log("Submit note response:", response.data);
 
    } catch (error) {
      console.error("Error submitting note:", error.message);
    }
  };

  const toggleGrouped = () => {
    setGrouped((prevGrouped) => !prevGrouped);
  };

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(data)) {
    console.log("Unexpected data structure:", data);
    return <div>Error: Invalid data structure</div>;
  }

  // Filter calls based on archive status
  const filteredCalls = filterBy === "archived" ? data.filter(call => call.is_archived) : (filterBy === "not_archived" ? data.filter(call => !call.is_archived) : data);

  // Group calls by date
  const groupedCalls = {};
  if (grouped) {
    filteredCalls.forEach((call) => {
      const date = new Date(call.created_at).toLocaleDateString();
      if (!groupedCalls[date]) {
        groupedCalls[date] = [];
      }
      groupedCalls[date].push(call);
    });
  } else {
    groupedCalls["ungrouped"] = filteredCalls;
  }

  // Pagination state
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);

  // Calculate current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailOpen = (callid, token) => {
    Promise.resolve()
      .then(() => {
        setCurrentCallIdForDetail(callid);
        setCurrentToken(token);
      })
      .then(() => {
        console.log(callid);
        console.log(token);
        console.log(currentToken + " this is currentToken");
        console.log(currentCallIdForDetail + " this is currentID");
        setOpenDetail(true);
      });
  };

  return (
    <div>
      <Button variant="contained" onClick={toggleGrouped}>
        {grouped ? "Ungroup Calls" : "Group Calls"}
      </Button>

      <FormControl sx={{ m: 1, minWidth: 100 }}>

  <Select
    value={filterBy}
    onChange={handleFilterChange}
    displayEmpty
    renderValue={() => 'Filter'}
  >
    <MenuItem value="all">All</MenuItem>
    <MenuItem value="archived">Archived</MenuItem>
    <MenuItem value="not_archived">Not Archived</MenuItem>
  </Select>
</FormControl>


      {Object.entries(groupedCalls).map(([date, calls]) => (
        <div key={date}>
          {grouped && <h3>{date}</h3>}
          <TableContainer component={Paper}>
            <Table>
            <TableHead>
  <TableRow>
    <TableCell><b>From</b></TableCell>
    <TableCell><b>To</b></TableCell>
    <TableCell><b>Direction</b></TableCell>
    <TableCell><b>Duration</b></TableCell>
    <TableCell><b>Status</b></TableCell>
    <TableCell><b>Add Note</b></TableCell>
  </TableRow>
</TableHead>

              <TableBody>
                {calls
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((call) => (
                    <TableRow
                      key={call.id}
    
                    >
                      <TableCell                   onClick={() => {
                        handleDetailOpen(call.id, token);
                      }}>{call.from}</TableCell>
                      <TableCell                   onClick={() => {
                        handleDetailOpen(call.id, token);
                      }}>{call.to}</TableCell>
                      <TableCell                   onClick={() => {
                        handleDetailOpen(call.id, token);
                      }}>{call.direction}</TableCell>
                      <TableCell                   onClick={() => {
                        handleDetailOpen(call.id, token);
                      }}>{call.duration}</TableCell>
                      <TableCell>
                        {call.is_archived ? (
                          <span
                            style={{
                              color: "gray",
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            onClick={() => handleArchiveCall(call)}
                          >
                            Archived
                          </span>
                        ) : (
                          <Button
                            style={{
                              color: "white",
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            variant="contained"
                            onClick={() => handleArchiveCall(call)}
                          >
                            Not Archived
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleAddNote(call.id)}
                        >
                          Add Note
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}

      {/* Pagination */}
      <div>
        {totalPages > 1 && !grouped && (
          <Stack direction="row" spacing={2}>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                variant="contained"
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </Button>
            ))}
          </Stack>
        )}
      </div>

      {/* Note Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            type="text"
            fullWidth
            value={noteContent}
            onChange={handleNoteChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitNote}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Call Detail Dialog */}
      {openDetail && (
        <CallDetailPage
          open={openDetail}
          setOpen={setOpenDetail}
          id={currentCallIdForDetail}
          token={currentToken}
        />
      )}
    </div>
  );
};

export default MainCallsPage;
