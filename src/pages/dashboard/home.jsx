import { useEffect, useState } from "react";
import { Card, CardContent, LinearProgress, TextField } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import apiInstance from "../auth/useAuth";
import { Button } from "@material-tailwind/react";
import useUserStore from "@/store/store";
import EventSidebar from "./homeEvent";
import CampaignCreate from "./campaign";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [contributionAmount, setContributionAmount] = useState({});
  const [comment, setComment] = useState({});
  const [error, setError] = useState({});
  const { user } = useUserStore();

  const fetchPostData = async () => {
    try {
      const res = await apiInstance.get(`/campaigns/`);
      setPosts(res.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, []);

  const handleContribution = async (postId) => {
    const amount = parseInt(contributionAmount[postId], 10);
    const post = posts.find((p) => p.id === postId);
    const remaining = post.total_target - post.collected;

    if (amount <= 0 || amount > remaining) {
      setError((prev) => ({
        ...prev,
        [postId]: `Contribution must be between 1 and ${remaining}`,
      }));
      return;
    }

    const commentData = {
      text: comment[postId] || "",
      collected: amount,
      campaign: postId,
      user: user[0]?.user_id,
    };
    console.log(JSON.stringify(commentData));
    try {
      await apiInstance.post(`/comments/`, commentData);
      fetchPostData();
      setContributionAmount((prev) => ({ ...prev, [postId]: "" }));
      setComment((prev) => ({ ...prev, [postId]: "" }));
      setError((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e, postId, setter) => {
    const { value } = e.target;
    setter((prev) => ({ ...prev, [postId]: value }));
  };

  return (
    <div className="flex justify-evenly bg-gray-100 min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <CampaignCreate fetchPostData={fetchPostData} />
        {posts.map((post) => (
          <Card key={post.id} className="mb-4 bg-white rounded-xl shadow-md">
            <CardContent>
              <div className="flex items-center space-x-3">
                {post.creator?.Profile?.image && (
                  <img
                    src={post.creator.Profile.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-bold">{post.creator?.Profile?.full_name}</h4>
                  <p className="text-sm text-gray-500">{post.urgency_level} Request</p>
                </div>
              </div>

              <p className="mt-2 text-lg">{post.title}</p>
              {post.image && <img src={post.image} alt="Campaign" className="mt-3 rounded-lg w-full" />}

              <div className="mt-4">
                <LinearProgress variant="determinate" value={post.progress_percentage} className="mt-1" />
                <p className="text-xs text-gray-500 mt-1">{post.progress_percentage}% of goal achieved</p>
              </div>

              <div className="mt-3 flex justify-between items-center text-gray-600">
                <p className="text-sm font-semibold">{post.collected} / {post.total_target} collected</p>
                <p>💬 {post?.comment_list || 0} Contributed</p>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <TextField
                  label="Contribution Amount"
                  type="number"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={contributionAmount[post.id] || ""}
                  onChange={(e) => handleInputChange(e, post.id, setContributionAmount)}
                />
                {error[post.id] && <p className="text-xs text-red-500">{error[post.id]}</p>}
                <TextField
                  label="Comment"
                  multiline
                  rows={2}
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={comment[post.id] || ""}
                  onChange={(e) => handleInputChange(e, post.id, setComment)}
                />
                <Button variant="contained" color="primary" className="mt-2" onClick={() => handleContribution(post.id)}>
                  Contribute
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        <div>
        <EventSidebar/>
        </div>
      
    </div>
  );
}
