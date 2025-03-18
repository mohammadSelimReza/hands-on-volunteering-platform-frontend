import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import apiInstance from "../auth/useAuth";
import useUserStore from "../../store/store";
import Toast from "../../configs/Toast";


const CampaignCreate = ({fetchPostData}) => {
    const {user} = useUserStore();
  const [open, setOpen] = useState(false);
  const [campaignData, setCampaignData] = useState({
    title: "",
    body: "",
    image: null,
    level: "Low",
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
        image: campaignData.image
    };
    try {
      const response = await apiInstance.post(`/campaigns/`,formData);
        console.log(response)
      if (response.status == 201) {
        fetchPostData();
        campaignData.title = "";
        campaignData.body = "";
        campaignData.level = "";
        campaignData.image = null;
        Toast().fire({
          title: `${"Successfull Posted"}`,
          icon:"success"
        })
        
        handleClose();
      } else {
        Toast().fire({
                title: `${"Unable to Post"}`,
                icon:"error"
              })
      }
    } catch (error) {
      Toast().fire({
              title: `${error}`,
              icon:"error"
            })}
  };

  return (
    <div className="flex flex-row items-center mb-10">
      {/* Open Modal Input */}
      <div
        className="w-full p-4 bg-white text-gray-700 border border-gray-300 rounded-lg cursor-pointer shadow-sm"
        onClick={handleOpen}
      >
        What's on your mind? Post here....
      </div>
      <div className="w-60 text-center font-bold">
        Points: {user[0]?.Profile?.point_achieved}
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
            label="Add Image URL for Campaing (Optional)"
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
