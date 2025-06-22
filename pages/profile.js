import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Avatar from "@/components/Avatar";
import PostCard from "@/components/PostCard";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", bio: "", avatar_url: "", username: "" });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchUser = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user found");
      return;
    }

    const uid = user.uid;
    setUserId(uid);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching profile:", profileError.message);
    }

    if (profileData) {
      setProfile(profileData);
    }

    const { data: userPosts, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", uid) // Make sure your posts table uses `user_id`
      .order("created_at", { ascending: false });

    if (postError) {
      console.error("Error fetching posts:", postError.message);
    }

    setPosts(userPosts || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        username: profile.username,
        name: profile.name,
        bio: profile.bio,
        avatar_url: profile.avatar_url || "",
      });

    if (error) {
      alert("Failed to update profile: " + error.message);
    } else {
      alert("Profile updated!");
      setEditMode(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading...</p>;

  return (
    <Layout>
      <Card>
        <div className="flex items-center gap-4">
          <Avatar size="lg" url={profile?.avatar_url} />
          <div>
            {!editMode ? (
              <>
                <h2 className="text-lg font-semibold text-gray-700">{profile?.username || "No username"}</h2>
                <h1 className="text-xl font-bold">{profile?.name || "Unnamed User"}</h1>
                <p className="text-gray-500">{profile?.bio || "No bio yet."}</p>
                <button
                  className="mt-2 text-blue-500 underline"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              </>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-3">
                <input
                  type="text"
                  placeholder="Username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full border px-4 py-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border px-4 py-2 rounded-md"
                />
                <textarea
                  placeholder="Bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full border px-4 py-2 rounded-md"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </form>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Your Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} {...post} />)
        )}
      </Card>
    </Layout>
  );
}
