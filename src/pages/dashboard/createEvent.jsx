import React, { useEffect, useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Stack, Chip, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import apiInstance from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/store';
import useSkillsInterestStore from '../../store/skillsInterestStore';
import authApiInstance from '../auth/usePrivateAuth';

const CreateEvent = () => {
  const {user} = useUserStore();
  const [thumbNail, setThumbNail] = useState("https://www.eclosio.ong/wp-content/uploads/2018/08/default.png");
  const [location, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [info, setInfo] = useState("");

  // Get skills and interests from the store
  const { skillsList, interestsList } = useSkillsInterestStore();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState("");
  const [selectedInterestId, setSelectedInterestId] = useState(0);

  const [eventData, setEventData] = useState({
    title: '',
    created_by: user[0]?.user_id,
    image: '',
    description: '',
    location: location,
    category: '',
    skills_required: [],
    private: false, // Default to unchecked (private = false)
    event_start: '',
    event_end: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setEventData({
      ...eventData,
      private: e.target.checked,
    });
  };

  const handleImage = () => {
    setThumbNail(eventData.image); // Set the thumbnail from eventData
  };
  const navigate = useNavigate("");
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure all values are correct
    if (!eventData.title || !eventData.created_by || !eventData.event_start || !eventData.event_end) {
      console.log("Please fill out the required fields.");
      return;
    }
  
    // Prepare the event data
    const eventDataToSubmit = {
      ...eventData,
      location: selectedLocation,
      category: selectedInterestId || null, // Ensure empty category is set to null or omitted if not required
      skills_required: selectedSkillId || [], // Empty array or selected skills
      private: eventData.private || false, // Default to false if not provided
      event_start: eventData.event_start, // Ensure the datetime is correct
      event_end: eventData.event_end // Ensure the datetime is correct
    };
  
    try {
      // Send request to the backend
      console.log(JSON.stringify(eventDataToSubmit));
      const response = await authApiInstance().post('/events/', eventDataToSubmit);
      console.log('Event created successfully:', response.data);
      navigate("/dashboard/events");
      // Redirect or handle response
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // Handle selecting skills and interests
  const handleSkillSelect = (skill) => {
    // Prevent adding duplicates
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill.name]);
      setSelectedSkillId([...selectedSkillId,skill.id]);
    }
  };

  const handleInterestSelect = (interest) => {
    // Prevent adding duplicates
    if (!selectedInterests.includes(interest)) {
      setSelectedInterests(interest.name);
      setSelectedInterestId(interest.id)
    }
  };

  const fetchLocation = async () => {
    try {
      const res = await apiInstance.get(`/event/location/`);
      setLocation(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div className="flex gap-12">
      {/* Form Section */}
      <div className="w-2/3 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Create Event</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <TextField
                label="Event Title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div>
              <TextField
                label="Image URL"
                name="image"
                value={eventData.image}
                onChange={handleChange}
                fullWidth
              />
              <Button variant="outlined" onClick={handleImage}>Set Thumbnail</Button>
            </div>
            <div>
              <TextField
                label="Description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </div>

            {/* Location Dropdown */}
            <div>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  name="location"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setEventData({
                      ...eventData,
                      location: { name: e.target.value }
                    });
                  }}
                >
                  {location.map((loc) => (
                    <MenuItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Skills Selection */}
            <Stack direction="row" spacing={2}>
              {interestsList.map((interest) => (
                <Chip
                  key={interest.id}
                  label={interest.name}
                  onClick={() => handleInterestSelect(interest)}
                  disabled={selectedInterests.includes(interest.name)}
                />
              ))}
            </Stack>

            {/* Interests Selection */}
            <Stack direction="row" spacing={2}>
              {skillsList.map((skill) => (
                <Chip
                  key={skill.id}
                  label={skill.name}
                  onClick={() => handleSkillSelect(skill)}
                  disabled={selectedSkills.includes(skill.name)}
                />
              ))}
            </Stack>

            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eventData.private}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Private Event"
              />
            </div>

            {/* Event Start/End */}
            <div className="flex gap-10">
              <div className="w-1/2">
                <TextField
                  label="Event Start"
                  type="datetime-local"
                  name="event_start"
                  value={eventData.event_start}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  label="Event End"
                  type="datetime-local"
                  name="event_end"
                  value={eventData.event_end}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="preview w-1/3 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Event Details</h1>
        <label htmlFor="courseThumbnail" className="form-label">Image Preview</label>
        <img
          style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "10px" }}
          className="mb-4"
          src={thumbNail || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
          alt="Event Thumbnail"
        />
        <h2 className="text-xl font-medium mb-6">{eventData.title || "Event Title"}</h2>
        <h2 className="text-base font-base mb-6">{eventData.description || "Event Details"}</h2>
        <h2 className="text-base font-base mb-6">{eventData.location.name || "Location"}</h2>
        <h2 className="text-base font-base mb-6">{eventData.category || "Category"}</h2>
        <h2 className="text-base font-base mb-6">
          {selectedSkills.length ? selectedSkills.join(', ') : 'No skills selected'}
        </h2>
        <h2 className="text-base font-base mb-6">
          {`${selectedInterests}` || 'No interests selected'}
        </h2>
      </div>
    </div>
  );
};

export default CreateEvent;
