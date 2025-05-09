"use client";
import { useState, useEffect, use } from 'react';
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
    resume: 'not found',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fileInput, setFileInput] = useState(null);
  const [confirmationType, setConfirmationType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId) => {
    try {
      setIsLoading(true);
      const formPayload = new FormData();
      formPayload.append('id', userId);
      const response = await fetch('https://quick-cover-user-195813819523.us-west1.run.app/fetch_user', {
        method: 'POST',
        body: formPayload,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message && data.message.includes('User found')) {
          const completeUserData = {
            ...data,
            resume: data.resume === 'not found' ? null : data.resume
          };

          console.log('Fetched user data:', completeUserData);
          setFormData(prev => ({
            ...prev,
            ...completeUserData
          }));
          setUser(completeUserData);
        }
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // First try to get user ID from localStorage
    const storedUser = localStorage.getItem('user');
    const tempUser = localStorage.getItem('tempUser');
    let userId = '';

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.id;
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    } else if (tempUser) {
      try {
        const parsedTempUser = JSON.parse(tempUser);
        setFormData(prev => ({
          ...prev,
          id: parsedTempUser.id,
          email: parsedTempUser.email,
          given_name: parsedTempUser.given_name,
          family_name: parsedTempUser.family_name,
        }));
      } catch (error) {
        console.error('Failed to parse temp user data:', error);
      }
    } else {
      // Fallback to query params if available
      userId = searchParams.get('id') || '';
    }

    // Set initial form data with whatever we have
    setFormData(prev => ({
      ...prev,
      id: userId,
      email: searchParams.get('email') || '',
      given_name: searchParams.get('given_name') || '',
      family_name: searchParams.get('family_name') || '',
      linkedin: searchParams.get('linkedin') || '',
      personal_website: searchParams.get('personal_website') || '',
    }));

    if (userId) {
      fetchUserData(userId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

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

      const endpoint = user 
        ? 'https://quick-cover-user-195813819523.us-west1.run.app/update_user'
        : 'https://quick-cover-user-195813819523.us-west1.run.app/add_user';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formPayload,
      });

      if (response.ok) {
        const userData = await response.json();
        const updatedResume = userData.resume || `found: uploaded on ${new Date().toISOString().split('T')[0]}`;
      
        setFormData(prev => ({
          ...prev,
          resume: updatedResume
        }));
        
        // Update local storage with new data
        const updatedUser = {
          ...formData,
          resume: updatedResume
        };

      //   const normalizedResume = 
      //   !data.resume || data.resume === 'not found' 
      //     ? 'not found' 
      //     : data.resume.includes('found:') 
      //       ? data.resume 
      //       : `found: ${data.resume}`; // Fallback in case format changes

      // const completeUserData = {
      //   ...data,
      //   resume: normalizedResume,
      // };
        
        // After successful update, fetch the latest data
        await fetchUserData(updatedUser.id);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.removeItem('tempUser');
        alert('Profile updated successfully!');
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
    const file = e.target.files[0];
    if (file) {
      setFileInput(file);
      setFormData(prev => ({
        ...prev,
        resume: `found: selected (${file.name})`
      }));
    }
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
  
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);
  
    if (confirmationType === 'update') {
      await confirmChanges();
    } else if (confirmationType === 'delete') {
      try {
        const formPayload = new FormData();
        formPayload.append('id', formData.id);
        const res = await fetch("https://quick-cover-user-195813819523.us-west1.run.app/delete_user", {
          method: "POST",
          body: formPayload,
        });
  
        const data = await res.json();
        if (res.ok && data.message.startsWith("Delete successfully")) {
          alert("Account deleted successfully!");
          localStorage.removeItem('user');
          localStorage.removeItem('tempUser');
          router.push("/");
          router.refresh();
        } else {
          alert("Failed to delete account. Please try again.");
          console.log("Delete error:", data);
          console.log(data.message);
        }
      } catch (err) {
        console.error("Delete error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <SectionWrapper className="pb-0 font-['comfortaa']">
        <div className="custom-screen">
          <div className="w-full lg:w-8/12 xl:w-8/12">
            <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl lg:text-2xl xl:text-3xl">
              Loading Profile...
            </h2>
            <p>Please wait while we load your profile data.</p>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="pb-0 font-['comfortaa']">
      <div className="custom-screen">
        <div className="w-full lg:w-8/12 xl:w-8/12">
            <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl lg:text-2xl xl:text-3xl">
              {user ? 'Update Your Profile' : 'Complete Your Profile'}
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="-mx-4 flex flex-wrap">
                <input type="hidden" name="id" value={formData.id} />
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
                <div className="w-full px-4">
                <div className="mb-8">
                    <label className="text-xl text-slate-900 font-medium mb-2 block">
                    {!formData.resume || formData.resume === "not found" 
                                ? "Upload Your Resume" 
                                : `Upload Your Resume: (Last ${formData.resume.split(': ')[1]})`}
                    </label>
                    <input 
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded" 
                    />
                    <p className="text-xs text-slate-500">Accepted file formats: PDF, DOC, and DOCX</p>
                </div>
                </div>
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
                onClick={() => {
                  setShowConfirmation(false);
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