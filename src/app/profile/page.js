"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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

  useEffect(() => {
    // Check localStorage first for existing user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Prefill form with stored user data
      setFormData(prev => ({
        ...prev,
        id: parsedUser.id || '',
        email: parsedUser.email || '',
        given_name: parsedUser.given_name || '',
        family_name: parsedUser.family_name || '',
        linkedin: parsedUser.linkedin || '',
        personal_website: parsedUser.personal_website || '',
        // Note: resume can't be stored in localStorage, so it remains null
      }));
    } else {
      // If no localStorage data, use search params
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
  }, [searchParams]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) formPayload.append(key, value);
      });

      const response = await fetch('https://quick-cover-user-195813819523.us-west1.run.app/add_user', {
        method: 'POST',
        body: formPayload,
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/');
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
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  return (
    <section className="overflow-hidden px-16 md:px-20 lg:px-28 font-['comfortaa']">
    <div className="container">
      <div className="-mx-4 flex flex-wrap justify-center">
        <div className="w-full px-4 lg:w-8/12 xl:w-8/12">
          <div
            className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
            data-wow-delay=".15s
            "
          >
            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
              Complete Your Profile
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="-mx-4 flex flex-wrap">
                {/* Pre-filled fields */}
                <input type="hidden" name="id" value={formData.id} />
                {/* Name */}
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label htmlFor="name" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                      First Name
                    </label>
                    <input
                        type="text" 
                        name="given_name" 
                        value={formData.given_name} 
                        onChange={handleChange} 
                        required 
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label htmlFor="name" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                      Last Name
                    </label>
                    <input
                        type="text" 
                        name="family_name" 
                        value={formData.family_name} 
                        onChange={handleChange} 
                        required 
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      Your Email
                    </label>
                    <input
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        // readOnly 
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                </div>
                {/* LinkedIn */}
                <div className="w-full px-4">
                  <div className="mb-8">
                    <label
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      LinkedIn Profile
                    </label>
                    <input
                        type="url" 
                        name="linkedin" 
                        value={formData.linkedin} 
                        onChange={handleChange} 
                        placeholder="https://linkedin.com/in/yourname" 
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    ></input>
                  </div>
                </div>
                {/* Personal Website */}
                <div className="w-full px-4">
                  <div className="mb-8">
                    <label
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      Personal Website
                    </label>
                    <input
                        type="url" 
                        name="personal_website" 
                        value={formData.personal_website} 
                        onChange={handleChange} 
                        placeholder="https://yourwebsite.com" 
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    ></input>
                  </div>
                </div>
                <div className="w-full px-4">
                <div className="mb-8">
                    <label className="text-sm text-slate-900 font-medium mb-2 block">Upload Your Resume:</label>
                    <input 
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFileInput(e.target.files[0])}
                        className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded" 
                    />
                    <p className="text-xs text-slate-500">Accepted file formats: PDF, DOC, and DOCX</p>
                </div>
                </div>
                <div className="w-full px-4">
                  <button className="shadow-submit dark:shadow-submit-dark rounded-sm bg-orange-500 px-9 py-4 text-base font-medium text-white duration-300 hover:bg-gray-500">
                    Save Changes
                  </button>
                </div>
  
              </div>
            </form>
          </div>
        </div>
        <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
        </div>
      </div>
    </div>
  </section>
  );
}

// Main export with Suspense boundary
export default function Profile() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}