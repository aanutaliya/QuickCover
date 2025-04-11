'use client';

import { useState } from 'react';

export default function Home() {
  // const [jobDesc, setJobDesc] = useState('');
  const [job_title, setJobTitle] = useState('');
  const [company_name, setComName] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    try {
      // Prepare your request data
      const requestData = {
        job_title,
        company_name,
      };

      const res = await fetch('https://gen-cover-195813819523.us-west1.run.app/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCoverLetter(data.coverLetter || data.message || 'No content received');
      console.log('Response data:', data);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-['comfortaa']">
      <header className="bg-zinc-50 text-black w-full py-4 sticky top-0 z-10">
        <div className="max-w-xl mx-5">
          <h1 className="text-3xl font-bold text-left">QuickCover</h1>
        </div>
      </header>
      
      <main className="flex-grow max-w-xl mx-auto p-4 w-full mt-4">
        <h1 className="text-2xl font-bold mb-4">Generate Your Cover Letter</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job Title */}
          <label className="block text-sm font-medium mb-2 text-xl">Job Title:</label>
          <input type="text" placeholder="Enter the job title" value={job_title} className="block w-full p-2 border rounded"
            onChange={(e) => setJobTitle(e.target.value)}
          />
          {/* Company Name */}
          <label className="block text-sm font-medium mb-2 text-xl">Company Name:</label>
          <input type="text" placeholder="Enter the company name" value={company_name} className="block w-full p-2 border rounded"
            onChange={(e) => setComName(e.target.value)}
          />
          {/* <label className="block text-sm font-medium mb-2">
            Upload Your Resume:
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="block w-full text-sm"
          /> */}

          {/* Job Desc */}
          {/* <label className="block text-sm font-medium mb-2 text-xl">Job Description:</label>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded"
          /> */}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </form>

        {coverLetter && (
          <div className="mt-8 border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Your Cover Letter:</h2>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
              {coverLetter}
            </pre>
          </div>
        )}
      </main>
      
      <footer className="bg-gray-800 text-white text-center py-4 w-full">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Cover Letter Generator. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}