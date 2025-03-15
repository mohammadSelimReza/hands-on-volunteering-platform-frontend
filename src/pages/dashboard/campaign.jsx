import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import useUserStore from "@/store/store";
import apiInstance from "../auth/useAuth";

const CampaignCreate = ({fetchPostData}) => {
    const {user} = useUserStore();
  const [open, setOpen] = useState(false);
  const [campaignData, setCampaignData] = useState({
    title: "",
    body: "",
    total_target: "",
    image: null,
    level: "Low", // Default value
  });

  // Open and Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaignData({ ...campaignData, [name]: value });
  };


  // Handle Form Submit
  const handleSubmit = async () => {
    const formData = {
        user_id: user[0]?.user_id,
        title: campaignData.title,
        body: campaignData.body,
        level: campaignData.level,
        total_target: campaignData.total_target,
        image: campaignData.image
    };
    console.log(JSON.stringify(formData));
    try {
      const response = await apiInstance.post(`/campaigns/`,formData);
        console.log(response)
      if (response.status == 201) {
        fetchPostData();
        campaignData.title = "";
        campaignData.body = "";
        campaignData.level = "";
        campaignData.total_target= 0;
        campaignData.image = null;
        console.log("Campaign posted successfully");
        
        handleClose();
      } else {
        console.error("Failed to post campaign");
      }
    } catch (error) {
      console.error("Error posting campaign:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Open Modal Input */}
      <div
        className="w-full max-w-md p-4 bg-white text-gray-700 border border-gray-300 rounded-lg cursor-pointer shadow-sm"
        onClick={handleOpen}
      >
        What's on your mind?
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="text-gray-900">Create a Campaign</DialogTitle>
        <DialogContent className="bg-white">
          <TextField
            fullWidth
            margin="dense"
            label="Campaign Title"
            name="title"
            value={campaignData.title}
            onChange={handleChange}
            InputProps={{ style: { backgroundColor: "white" } }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Campaign Details"
            name="body"
            multiline
            rows={4}
            value={campaignData.body}
            onChange={handleChange}
            InputProps={{ style: { backgroundColor: "white" } }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Total Contribution Needed"
            name="total_target"
            type="number"
            value={campaignData.total_target}
            onChange={handleChange}
            InputProps={{ style: { backgroundColor: "white" } }}
          />

          {/* Level Dropdown */}
          <div className="my-4">
            <h3>Prioty Level</h3>
          <FormControl fullWidth margin="dense">
            <Select
              name="level"
              value={campaignData.level}
              onChange={handleChange}
              className="bg-white"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
          </div>

          {/* Image Upload */}
          <TextField
            fullWidth
            margin="dense"
            label="Add Image URL for Campaing"
            name="image"
            value={campaignData.image}
            onChange={handleChange}
            InputProps={{ style: { backgroundColor: "white" } }}
          />
        </DialogContent>
        <DialogActions className="bg-gray-100">
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Post Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CampaignCreate;
