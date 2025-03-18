import { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";
import { Button } from "@material-tailwind/react";
import apiInstance from "../auth/useAuth";
import EventSidebar from "./homeEvent";
import CampaignCreate from "./campaign";
import useUserStore from "../../store/store";
import Toast from "../../configs/Toast";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [contributingStatus, setContributingStatus] = useState({});
  const { user } = useUserStore();
  const [comments, setComments] = useState([]);

  const fetchPostData = async () => {
    try {
      const res = await apiInstance.get(`/campaigns/`);
      setPosts(res.data.results);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchCommentData = async () => {
    try {
      const resComment = await apiInstance.get(`/comments/?user_id=${user[0]?.user_id}`);
      setComments(resComment.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostData();
    fetchCommentData();
  }, []);

  const handleContribution = async (postId, option) => {
    const newStatus = option;

    try {
      const commentData = {
        option: option,
        campaign: postId,
        user: user[0].user_id,
      };

      const res = await apiInstance.post(`/comments/`, commentData);

      setContributingStatus(prevState => ({
        ...prevState,
        [postId]: newStatus,
      }));

      Toast().fire({
        title: `${res.data.message}`,
        icon: "success",
      });
    } catch (error) {
      Toast().fire({
        title: `${error.response.data.message}`,
        icon: "error",
      });
    }
  };

  return (
    <div className="flex justify-evenly bg-gray-100 min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <CampaignCreate fetchPostData={fetchPostData} />

        {posts.map((post) => {
          const comment = comments.find((comment) => comment.campaign === post.id);

          return (
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
                <p className="mt-2 text-lg">{post.body}</p>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 mt-1">
                    Total Volunteered: {post.total_volunteered_time || 0} hours from {post.total_comments || 0} people
                  </p>
                </div>

                <div className="mt-3 flex justify-between items-center text-gray-600">
                  <p className="text-sm font-semibold">Ongoing for {post.total_time_from_start || 0} hours</p>
                  <p>💬 {post.total_comments || 0} Contributed</p>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  {post.creator.user_id === user[0].user_id ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      className="mt-2"
                    >
                      This has been posted by you.
                    </Button>
                  ) : (
                    <>
                      {contributingStatus[post.id] === "Started" || comment?.option === "Started" ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          className="mt-2"
                          onClick={() => handleContribution(post.id, "Stop")}
                        >
                          Stop Contributing
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          className="mt-2"
                          onClick={() => handleContribution(post.id, "Started")}
                        >
                          Start Contributing
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <EventSidebar />
      </div>
    </div>
  );
}
