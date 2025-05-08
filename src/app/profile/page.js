"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SectionWrapper from "../../components/SectionWrapper";

function ProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    given_name: '',
    family_name: '',
    linkedin: '',
    personal_website: '',
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fileInput, setFileInput] = useState(null);
  const [confirmationType, setConfirmationType] = useState(null);
  


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setFormData(prev => ({
            ...prev,
            id: parsedUser.id || '',
            email: parsedUser.email || '',
            given_name: parsedUser.given_name || '',
            family_name: parsedUser.family_name || '',
            linkedin: parsedUser.linkedin || '',
            personal_website: parsedUser.personal_website || '',
          }));
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      } else {
        const tempUser = localStorage.getItem('tempUser');
        if (tempUser) {
          try {
            const parsedTempUser = JSON.parse(tempUser);
            setFormData(prev => ({
              ...prev,
              id: parsedTempUser.id || '',
              email: parsedTempUser.email || '',
              given_name: parsedTempUser.given_name || '',
              family_name: parsedTempUser.family_name || '',
            }));
          } catch (error) {
            console.error('Failed to parse temp user data:', error);
          }
        } else {
          // Fallback to query params if available
          setFormData({
            id: searchParams.get('id') || '',
            email: searchParams.get('email') || '',
            given_name: searchParams.get('given_name') || '',
            family_name: searchParams.get('family_name') || '',
            linkedin: '',
            personal_website: '',
            resume: null
          });
        }
      }
    }
  }, [searchParams]);

  // Fetch user data once the formData.id is set
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch('https://quick-cover-user-195813819523.us-west1.run.app/fetch_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: formData.id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data:', data);
        if (data.message === "success") {
          setFormData(prev => ({
            ...prev,
            given_name: data.given_name || '',
            family_name: data.family_name || '',
            email: data.email || '',
            linkedin: data.linkedin || '',
            personal_website: data.personal_website || '',
            resume: data.resume || null,
          }));

          // Update localStorage and user state
          // localStorage.setItem('user', JSON.stringify(data));
          setUser(data);
        }
      } else {
        console.warn('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  fetchUserData();
}, [formData.id]);


  const confirmChanges = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formPayload.append(key, value);
        }
      });
      
      if (fileInput) {
        formPayload.append('resume', fileInput);
      }

      // Determine API endpoint based on whether user exists
      const endpoint = user 
        ? 'https://quick-cover-user-195813819523.us-west1.run.app/update_user'
        : 'https://quick-cover-user-195813819523.us-west1.run.app/add_user';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formPayload,
      });

      if (response.ok) {
        const userData = await response.json();
        // localStorage.setItem('user', JSON.stringify(userData));
        localStorage.removeItem('tempUser');
        setUser(userData);
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('Failed to save changes. Please try again.');
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]);
  };
  
  const handleDelete = () => {
    setConfirmationType('delete');
    setShowConfirmation(true);
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    setConfirmationType('update');
    setShowConfirmation(true);
  };
  
  // confirm logic
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);
  
    if (confirmationType === 'update') {
      await confirmChanges();
    } else if (confirmationType === 'delete') {
      try {
        const res = await fetch("https://quick-cover-user-195813819523.us-west1.run.app/delete_user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: formData.id }),
        });
  
        const data = await res.json();
        if (res.ok && data.message === "success") {
          localStorage.removeItem("user");
          router.push("/");
        } else {
          alert("Failed to delete account. Please try again.");
        }
      } catch (err) {
        console.error("Delete error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SectionWrapper className="pb-0 font-['comfortaa']">
      <div className="custom-screen">
        <div className="w-full lg:w-8/12 xl:w-8/12">
            <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl lg:text-2xl xl:text-3xl">
              {user ? 'Update Your Profile' : 'Complete Your Profile'}
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="-mx-4 flex flex-wrap">
                {/* Pre-filled fields */}
                <input type="hidden" name="id" value={formData.id} />
                {/* Name */}
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label htmlFor="name" className="mb-3 block text-xl font-medium">
                      First Name
                    </label>
                    <input
                        type="text" 
                        name="given_name" 
                        value={formData.given_name} 
                        onChange={handleChange} 
                        required 
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label htmlFor="name" className="mb-3 block text-xl font-medium">
                      Last Name
                    </label>
                    <input
                        type="text" 
                        name="family_name" 
                        value={formData.family_name} 
                        onChange={handleChange} 
                        required 
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary"
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-xl font-medium"
                    >
                      Your Email
                    </label>
                    <input
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        readOnly={!!user}
                      className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary"
                    />
                  </div>
                </div>
                {/* LinkedIn */}
                <div className="w-full px-4">
                  <div className="mb-8">
                    <label
                      className="mb-3 block text-xl font-medium"
                    >
                      LinkedIn Profile
                    </label>
                    <input
                        type="url" 
                        name="linkedin" 
                        value={formData.linkedin} 
                        onChange={handleChange} 
                        placeholder="https://linkedin.com/in/yourname" 
                      className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary"
                    ></input>
                  </div>
                </div>
                {/* Personal Website */}
                <div className="w-full px-4">
                  <div className="mb-8">
                    <label
                      className="mb-3 block text-xl font-medium"
                    >
                      Personal Website
                    </label>
                    <input
                        type="url" 
                        name="personal_website" 
                        value={formData.personal_website} 
                        onChange={handleChange} 
                        placeholder="https://yourwebsite.com" 
                      className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary"
                    ></input>
                  </div>
                </div>
                {/* Resume Upload */}
                <div className="w-full px-4">
                <div className="mb-8">
                    <label className="text-xl text-slate-900 font-medium mb-2 block">Upload Your Resume:</label>
                    <input 
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded" 
                    />
                    <p className="text-xs text-slate-500">Accepted file formats: PDF, DOC, and DOCX</p>
                </div>
                </div>
                {/* Confirmation Message */}
                <div className="w-full px-4">
                <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="shadow-submit rounded-sm bg-orange-500 px-9 py-4 text-base font-medium text-white duration-300 hover:bg-gray-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="w-full px-4">
                <p className="text-base font-medium text-body-color pt-10">
                    Would you like to say goodbye to your account? <span> </span>
                    <button 
                      type="button"
                      onClick={handleDelete}
                      className="shadow-submit text-base font-bold text-orange-600 duration-300 hover:text-gray-600 hover:underline disabled:opacity-50"
                    >
                      Delete Your Account
                    </button>
                  </p>

                </div>
              </div>
            </form>
          </div>
  </div>
  {/* Confirmation Dialog */}
  {showConfirmation && (
  <div className="fixed inset-0 bg-current opacity-90 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
      <h3 className="text-lg font-bold mb-4">
        {confirmationType === 'delete' ? 'Confirm Deletion' : 'Confirm Changes'}
      </h3>
      <p className="mb-6">
        {confirmationType === 'delete' 
          ? 'Are you sure you want to permanently delete your account? This action cannot be undone.'
          : `Are you sure you want to ${user ? 'update' : 'create'} your profile?`}
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => {setShowConfirmation(false);
            setConfirmationType(null);
          }}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 ${
            confirmationType === 'delete' 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-orange-500 hover:bg-orange-600'
          } text-white rounded`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm'}
        </button>
      </div>
    </div>
  </div>
)}
  {/* {showConfirmation && (
        <div className="fixed inset-0 bg-current opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Changes</h3>
            <p className="mb-6">Are you sure you want to {user ? 'update' : 'create'} your profile?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmChanges}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )} */}
  </SectionWrapper>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}