import Image from "next/image";
import Avatar from "./Avatar";
import Card from "./Card";
import { AiOutlineHeart, AiFillBell } from 'react-icons/ai';
import { FaRegComment, FaTimes } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { BsShare, BsThreeDotsVertical, BsFillBookmarksFill } from 'react-icons/bs';
import { IoImageOutline } from 'react-icons/io5';
import { GoAlert } from 'react-icons/go';
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PostCard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Detect login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const openDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(true);
  };

  const requireLogin = () => {
    alert("Please login to use this feature.");
    router.push("/login");
  };

  return (
    <Card>
      <div className='flex gap-3'>
        <div>
          <Link href={'/profile'}>
            <span className='cursor-pointer'><Avatar /></span>
          </Link>
        </div>
        <div className='grow'>
          <p>
            <Link href={'/profile'}>
              <span className='mr-1 font-semibold cursor-pointer hover:underline'>John Doe</span>
            </Link>
            shared a <a className='text-socialBlue font-semibold'>post</a>
          </p>
          <p className='text-gray-500 text-sm'>Posted 2 hours ago</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button onClick={openDropdown} className='text-gray-500 hover:text-gray-800'>
            <BsThreeDotsVertical />
          </button>
          {dropdownOpen && (
            <div className='absolute -right-6 bg-white shadow-lg shadow-gray-700 p-3 rounded-md border-gray-100 w-52 z-10'>
              <a href="#" className='text-sm flex gap-2 py-2 hover:bg-blue-100 rounded-md'><BsFillBookmarksFill />Save post</a>
              <a href="#" className='text-sm flex gap-2 py-2 hover:bg-blue-100 rounded-md'><AiFillBell />Turn notifications</a>
              <a href="#" className='text-sm flex gap-2 py-2 hover:bg-blue-100 rounded-md'><FaTimes />Hide</a>
              <a href="#" className='text-sm flex gap-2 py-2 hover:bg-red-100 text-red-600 rounded-md'><RiDeleteBin6Fill />Delete</a>
              <a href="#" className='text-sm flex gap-2 py-2 hover:bg-red-100 text-red-600 rounded-md'><GoAlert />Report</a>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className='my-4 text-sm'>This is a demo post content with an image.</p>
        <div className='rounded-md overflow-hidden'>
          <Image src="/images/santorini.jpg" width={900} height={900} alt="santorini" />
        </div>
      </div>

      <div className='mt-5 flex gap-8'>
        <button
          className='flex gap-2 items-center'
          onClick={() => {
            if (!user) return requireLogin();
            // handle like
            console.log("Liked post");
          }}
        >
          <AiOutlineHeart />72
        </button>

        <button
          className='flex gap-2 items-center'
          onClick={() => {
            if (!user) return requireLogin();
            // handle comment
            console.log("Comment clicked");
          }}
        >
          <FaRegComment />11
        </button>

        <button
          className='flex gap-2 items-center'
          onClick={() => {
            if (!user) return requireLogin();
            // handle share
            console.log("Share clicked");
          }}
        >
          <BsShare />4
        </button>
      </div>

      <div className='flex mt-4 gap-3'>
        <div><Avatar /></div>
        <div className='border grow rounded-md relative'>
          <textarea
            disabled={!user}
            className='block w-full overflow-hidden p-3 px-4 h-12'
            placeholder={user ? 'Leave a comment' : 'Login to comment'}
          />
          <button className='absolute top-3 right-3 text-gray-400'>
            <IoImageOutline className='w-7 h-7' />
          </button>
        </div>
      </div>
    </Card>
  );
}
