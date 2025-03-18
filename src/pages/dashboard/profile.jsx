import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  Textarea,
} from "@material-tailwind/react";
import {
  HomeIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box, Button, Input, MenuItem, Select, TextField } from "@mui/material";

import apiInstance from "../auth/useAuth";
import useSkillsInterestStore from "../../store/skillsInterestStore";
import ProfileInfoCard from "../../widgets/cards/profile-info-card";
import useUserStore from "../../store/store";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export function Profile() {
  const { skillsList,interestsList } = useSkillsInterestStore();
  const { user,updateProfile } = useUserStore();
  const [skills, setSkills] = useState([]);
  const [interest, setInterest] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [personalInfo, setPersonalInfo] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [history,setHistory] = useState([]);
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    if (user) {
      setFirstName(user[0]?.first_name || "");
      setLastName(user[0]?.last_name || "");
      setLocation(user[0]?.Profile?.city || "");
      setPersonalInfo(user[0]?.Profile?.info || "");
      setSkills(user[0].user_skills);
      setInterest(user[0].user_interest);
      setSelectedSkills(user[0]?.user_skills.map((s) => s.skill.id) || []);
      setSelectedInterests(user[0]?.user_interest.map((i) => i.cause.id) || []);
      fetchHistory(user[0]?.user_id)
      fetchPost(user[0]?.user_id)
    }
  }, [user]); 
  const fetchHistory = async (id) => {
    if (!id) {
      console.error("User ID is undefined. Cannot fetch history.");
      return;
    }
    
    console.log("Fetching history for user ID:", id);
    
    try {
      const response = await apiInstance.get(`/campaign/history/${id}`);
      console.log("Fetched history:", response.data); // Debug response
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
  const fetchPost = async (id) => {
    if (!id) {
      console.error("User ID is undefined. Cannot fetch history.");
      return;
    }
    
    console.log("Fetching history for user ID:", id);
    
    try {
      const response = await apiInstance.get(`/post/history/${id}`);
      console.log("Fetched post:", response.data.slice(0,1)); // Debug response
      setPosts(response.data.slice(0,1));
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      first_name: firstName,
      last_name: lastName,
      location,
      personal_info: personalInfo,
      skills: selectedSkills,
      interests: selectedInterests,
    };
  
    console.log("Updated Profile:", JSON.stringify(userData));
  
    try {
      const response = await updateProfile(user[0]?.user_id, userData); // ✅ Corrected function call
      alert("Profile Updated Successfully!");
      console.log("Response from Backend:", response);
      setFirstName(response?.first_name || firstName);
      setLastName(response?.last_name || lastName);
      setLocation(response?.location || location);
      setPersonalInfo(response?.personal_info || personalInfo);
      setSelectedSkills(response?.skills || selectedSkills);
      setSelectedInterests(response?.interests || selectedInterests);
    } catch (error) {
      console.log(error)
    }
  };
  const handleCertificate = async() =>{
    try {
      await apiInstance.get(`/certificate/${user[0]?.user_id}/`)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={`${user[0]?.Profile?.image}`}
                alt="profile-pic"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {user[0]?.Profile?.full_name}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  @{user[0]?.username}
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value={activeTab}>
                <TabsHeader>
                  <Tab value="profile" onClick={() => setActiveTab("profile")}>
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Profile
                  </Tab>
                  <Tab value="history" onClick={() => {
                    setActiveTab("history");
                  }}>
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    History
                  </Tab>
                  <Tab value="settings" onClick={() => setActiveTab("settings")}>
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "history" && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Typography variant="h5" className="mb-4 font-semibold">
                Your Past Activities On Campaign
              </Typography>

              {history.length === 0 ? (
                <Typography>No history available.</Typography>
              ) : (
                <ul className="space-y-4">
                  {history.map((item, index) => (
                    <li key={index} className="p-4 border rounded-md shadow-sm">
                      <Typography variant="h6"> Campaign Name: {item.campaign.title}</Typography>
                      <Typography variant="body2" color="gray">
                        Date: {new Date(item.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="gray">
                        Contributed: {item.collected}
                      </Typography>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {activeTab === "profile" && (
            <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
              <ProfileInfoCard
                title="Profile Information"
                description={`${user[0]?.Profile?.info}`}
                details={{
                  "first name": `${user[0]?.first_name}`,
                  "last name": `${user[0]?.last_name}`,
                  email: `${user[0]?.email}`,
                  location: `${user[0]?.Profile?.city}`,
                }}
                action={
                  <Tooltip content="Edit Profile">
                    <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                  </Tooltip>
                }
              />

              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Skills & Interests
                </Typography>
                <div className="flex flex-col gap-12">
                  <div>
                    <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                      Skills:
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      {skills.map((name) => (
                        <Item key={name?.skill?.name}>{name?.skill?.name}</Item>
                      ))}
                    </Stack>
                  </div>
                  <div>
                    <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                      Interests:
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      {interest.map((name) => (
                        <Item key={name?.cause?.name}>{name?.cause?.name}</Item>
                      ))}
                    </Stack>
                  </div>
                </div>
              </div>
              <div>
              <div className="mb-6">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Your Recent Post
              </Typography>
              <ul className="flex flex-col gap-6">
              {posts.length === 0 ? (
                <Typography>No history available.</Typography>
              ) : (
                <ul className="space-y-4">
                  {posts.map((post) => (
                    <li key={post.id} className="p-4 border rounded-md shadow-sm">
                      <Typography variant="h6"> Campaign Name: {post.title}</Typography>
                      <Typography variant="body2" color="gray">
                        Date: {new Date(post.created_at).toLocaleDateString()}
                      </Typography>
                    </li>
                  ))}
                </ul>
              )}
              </ul>
              </div>
              <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Your Recent Post
              </Typography>
              <div className="p-4 border rounded-md shadow-sm">
                {
                  user[0]?.Profile?.point_achieved >= 20
                  ?
                  (
                  <Button onClick={()=>handleCertificate()}>
                    Get Your Certificate Now!!!
                  </Button>
                  )
                  :
                  (
                    <p>You have to contriubte more.</p>
                  )
                }
              </div>
              </div>
              </div>
            </div>
          )}
          {activeTab === "settings" && (
             // Settings Tab - Editable Form
             <div className="p-6 bg-white rounded-lg shadow-md">
             <form onSubmit={handleSubmit}>
               {/* Name Section */}
               <Typography variant="h5" className="mb-2 font-semibold">
                 Name:
               </Typography>
               <div className="flex gap-4">
                 <TextField
                   fullWidth
                   label="First Name"
                   variant="outlined"
                   value={firstName}
                   onChange={(e) => setFirstName(e.target.value)}
                 />
                 <TextField
                   fullWidth
                   label="Last Name"
                   variant="outlined"
                   value={lastName}
                   onChange={(e) => setLastName(e.target.value)}
                 />
               </div>
       
               {/* Personal Information */}
               <Typography variant="h5" className="mt-6 mb-2 font-semibold">
                 Personal Information:
               </Typography>
               <Textarea
                 placeholder="Write about yourself..."
                 minRows={3}
                 value={personalInfo}
                 onChange={(e) => setPersonalInfo(e.target.value)}
                 className="w-full"
               />
       
               {/* Location */}
               <Typography variant="h5" className="mt-6 mb-2 font-semibold">
                 Location:
               </Typography>
               <TextField
                 fullWidth
                 label="Location"
                 variant="outlined"
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
               />
       
               {/* Skills & Interests */}
               <Typography variant="h5" className="mt-6 mb-2 font-semibold">
                 Skills & Interests:
               </Typography>
               <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {/* Multi-Select Skills */}
<TextField
  select
  fullWidth
  label="Select Skills"
  variant="outlined"
  value={selectedSkills}
  onChange={(e) => setSelectedSkills(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)}
  SelectProps={{
    multiple: true,
  }}
>
  {skillsList.map((skill) => (
    <MenuItem key={skill.id} value={skill.id}>
      {skill.name}
    </MenuItem>
  ))}
</TextField>

{/* Multi-Select Interests */}
<TextField
  select
  fullWidth
  label="Select Interests"
  variant="outlined"
  value={selectedInterests}
  onChange={(e) => setSelectedInterests(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)}
  SelectProps={{
    multiple: true,
  }}
>
  {interestsList.map((interest) => (
    <MenuItem key={interest.id} value={interest.id}>
      {interest.name}
    </MenuItem>
  ))}
</TextField>
               </Box>
       
               {/* Save Button */}
               <div className="mt-6">
                 <Button type="submit" variant="contained" color="primary">
                   Save Changes
                 </Button>
               </div>
             </form>
           </div>
          ) }
  
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
