import { useState, useEffect } from "react";
import Avatar from "./Avatar";
import Card from "./Card";
import { BsUniversalAccess, BsFillSunFill } from "react-icons/bs";
import { GiPositionMarker } from "react-icons/gi";
import { supabase } from "@/lib/supabaseClient";
import { auth } from "@/lib/firebase";

export default function PostFormCard() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSharePost = async () => {
    if (!content.trim() && !image) return;

    setLoading(true);

    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      alert("You must be logged in to post.");
      setLoading(false);
      return;
    }

    const uid = firebaseUser.uid;
    let image_url = null;

    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, image);

      if (uploadError) {
        console.error(uploadError);
        alert("Image upload failed.");
        setLoading(false);
        return;
      }

      image_url = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: uid,
      content,
      image_url,
    });

    if (error) {
      console.error(error);
      alert("Failed to share post.");
    } else {
      setContent("");
      setImage(null);
    }

    setLoading(false);
  };

  return (
    <Card>
      <div className="flex gap-2">
        <div>
          <Avatar />
        </div>
        <textarea
          className="grow p-3 h-14 overflow-y-hidden"
          placeholder={"What's on your mind?"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
      </div>

      {image && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="max-h-40 rounded"
          />
        </div>
      )}

      <div className="flex gap-5 items-center mt-2">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
        </div>
        <div className="grow text-right">
          <button
            onClick={handleSharePost}
            disabled={loading}
            className="bg-socialBlue text-white px-5 py-1 rounded-md"
          >
            {loading ? "Posting..." : "Share a post"}
          </button>
        </div>
      </div>
    </Card>
  );
}
