'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { useRouter } from 'next/navigation';
import SectionWrapper from "../../SectionWrapper"
import NavLink from "../NavLink"
import Image from "next/image"

const CoverLetterPDF = ({ coverLetter }) => {
  const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica' },
    title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
    content: { fontSize: 12, lineHeight: 1.5 }
  });

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.content}>{coverLetter}</Text>
      </Page>
    </Document>
  );
};

const CTA = () => {
const [formData, setFormData] = useState({
    job_description: '',
    job_title: '',
    company_name: ''
  });
  const [fileInput, setFileInput] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("User data from localStorage:", parsedUser);
        setUser(parsedUser);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('job_title', formData.job_title);
      formDataToSend.append('company_name', formData.company_name);
      formDataToSend.append('job_description', formData.job_description);
      
      if (fileInput) {
        formDataToSend.append('file', fileInput);
      }

      const res = await fetch('https://gen-cover-195813819523.us-west1.run.app/create_resume_user', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCoverLetter(data.gen_res);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
 
    return (
        <SectionWrapper id="cta" className="pb-0">
            <div className="custom-screen">
                <div className="items-start gap-x-12 lg:flex">
                    <div className="flex-1 lg:block">
                    {user ? (
                        <h1 className="text-2xl font-bold mb-4">Welcome, {user.given_name}!</h1>
                        ) : (
                        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>)}
                        
                        {error && (
                        <div className="mb-4 p-4 bg-red-100 text-orange-500 rounded">
                            {error}
                        </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-2 text-xl">Job Title:</label>
                            <input 
                            type="text" 
                            name="job_title"
                            placeholder="Enter the job title" 
                            value={formData.job_title} 
                            className="block w-full p-2 border rounded"
                            onChange={handleInputChange}
                            required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-2 text-xl">Company Name:</label>
                            <input 
                            type="text" 
                            name="company_name"
                            placeholder="Enter the company name" 
                            value={formData.company_name} 
                            className="block w-full p-2 border rounded"
                            onChange={handleInputChange}
                            required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-2 text-xl">Job Description:</label>
                            <textarea
                            name="job_description"
                            placeholder="Paste the job description here..."
                            value={formData.job_description}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full p-2 border rounded"
                            required
                            />
                        </div>
                        <div>
                            <label className="text-xl text-slate-900 font-medium mb-2 block">Upload Your Resume:</label>
                            <input 
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setFileInput(e.target.files[0])}
                            className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded" 
                            />
                            <p className="text-xs text-slate-500">Accepted file formats: PDF, DOC, and DOCX</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                        >
                            {loading ? 'Generating...' : 'Generate Cover Letter'}
                        </button>
                        </form>
                    </div>
                    <div className="max-w-xl mt-6 md:mt-0 lg:max-w-2xl">
                        <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                        Generate Your Cover Letter
                        </h2>
                        <div className='mt-4 bg-gray-100 p-4 rounded w-full h-96 font-["geistsans"]'>
                        {coverLetter && (
                                  <div className="mt-8 border-t pt-4">
                                    <h2 className="text-xl font-semibold mb-2">Your Cover Letter:</h2>
                                    <textarea 
                                      className="whitespace-pre-wrap bg-gray-100 p-4 rounded w-full h-96 font-['geistsans']"
                                      value={coverLetter}
                                      onChange={(e) => setCoverLetter(e.target.value)}
                                    />
                        
                                    <PDFDownloadLink
                                      document={<CoverLetterPDF coverLetter={coverLetter} />}
                                      fileName="cover_letter.pdf"
                                      className="block mt-4"
                                    >
                                      {({ loading }) => (
                                        <button
                                          className={`w-full py-2 px-4 rounded-md text-white font-medium font-['comfortaa'] ${loading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-gray-600'} transition-colors`}
                                        >
                                          {loading ? 'Preparing PDF...' : 'Download as PDF'}
                                        </button>
                                      )}
                                    </PDFDownloadLink>
                                  </div>
                                )}
                        </div>

                        {/* <p className="mt-3 text-gray-600">
                            Blinder, a software development company, helps to digitize businesses by focusing on client’s business challenges, needs. We value close transparent cooperation and encourage our clients to participate actively in the project development life cycle.
                        </p> */}
                        {/* <NavLink
                            href="/get-started"
                            className="inline-block mt-4 font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                        >
                            Get started
                        </NavLink> */}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    )
}

export default CTA