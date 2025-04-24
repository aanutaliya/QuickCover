'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { useRouter } from 'next/navigation';
import Hero from '@/components/ui/Hero';
import Features from '@/components/ui/Features';
import CTA from '@/components/ui/CTA';


// const CoverLetterPDF = ({ coverLetter }) => {
//   const styles = StyleSheet.create({
//     page: { padding: 40, fontFamily: 'Helvetica' },
//     title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
//     content: { fontSize: 12, lineHeight: 1.5 }
//   });

//   return (
//     <Document>
//       <Page style={styles.page}>
//         <Text style={styles.content}>{coverLetter}</Text>
//       </Page>
//     </Document>
//   );
// };

export default function Home() {
  // const [formData, setFormData] = useState({
  //   job_description: '',
  //   job_title: '',
  //   company_name: ''
  // });
  // const [fileInput, setFileInput] = useState(null);
  // const [coverLetter, setCoverLetter] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [user, setUser] = useState(null);
  // const router = useRouter();

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append('job_title', formData.job_title);
  //     formDataToSend.append('company_name', formData.company_name);
  //     formDataToSend.append('job_description', formData.job_description);
      
  //     if (fileInput) {
  //       formDataToSend.append('file', fileInput);
  //     }

  //     const res = await fetch('https://gen-cover-195813819523.us-west1.run.app/test', {
  //       method: 'POST',
  //       body: formDataToSend,
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     setCoverLetter(data.gen_res);
  //   } catch (err) {
  //     setError(err.message);
  //     console.error('Fetch error:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('user');
  //   setUser(null);
  // };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-['comfortaa']">
      {/* <header className="bg-zinc-50 text-black w-full py-4 sticky top-0 z-10">
        <div className="w-full px-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">QuickCover</h1>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full"
                />
                <button 
                  onClick={handleLogout}
                  className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => router.push('/auth/login')}
                className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header> */}
      
      <main >
        <Hero />
        <Features />
        <CTA />
        {/* 
        {user ? (
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
        ) : (
          <h1 className="text-2xl font-bold mb-4">Welcome!</h1>)}

        <h1 className="text-2xl font-bold mb-4">Generate Your Cover Letter</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
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
            className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </form> */}

        {/* {coverLetter && (
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
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
                >
                  {loading ? 'Preparing PDF...' : 'Download as PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        )} */}
      </main>
    </div>
  );
}