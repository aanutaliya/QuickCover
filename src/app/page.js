'use client';
import { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
//import {CoverLetterPDF} from './components/coverletterPdf';
import { PDFViewer } from '@react-pdf/renderer';

const CoverLetterPDF = ({ coverLetter }) => {
  const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica' },
    title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
    content: { fontSize: 12, lineHeight: 1.5 }
  });

  return (
    <Document>
      <Page style={styles.page}>
        {/* <Text style={styles.title}>Cover Letter</Text> */}
        <Text style={styles.content}>{coverLetter}</Text>
      </Page>
    </Document>
  );
};

export default function Home() {
  const [job_description, setJobDesc] = useState('');
  const [job_title, setJobTitle] = useState('');
  const [company_name, setComName] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append form fields
      formData.append('job_title', job_title);
      formData.append('company_name', company_name);
      formData.append('job_description', job_description);
      
      // Append the resume file (if exists)
      if (fileInput) {
        formData.append('file', fileInput);
      }

      // Debug here (before fetch)
      console.log([...formData.entries()]);

      const res = await fetch('https://gen-cover-195813819523.us-west1.run.app/test', {
        method: 'POST',
        body: formData,

      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCoverLetter(data.gen_res);
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
          <label className="block font-medium mb-2 text-xl">Job Title:</label>
          <input type="text" placeholder="Enter the job title" value={job_title} className="block w-full p-2 border rounded"
            onChange={(e) => setJobTitle(e.target.value)}
          />
          {/* Company Name */}
          <label className="block font-medium mb-2 text-xl">Company Name:</label>
          <input type="text" placeholder="Enter the company name" value={company_name} className="block w-full p-2 border rounded"
            onChange={(e) => setComName(e.target.value)}
          />

          {/* Job Desc */}
          <label className="block font-medium mb-2 text-xl">Job Description:</label>
          <textarea
            placeholder="Paste the job description here..."
            value={job_description}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded"
          />

          {/* Upload Resume */}
          <label class="text-xl text-slate-900 font-medium mb-2 block">Upload Your Resume:</label>
          <input type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFileInput(e.target.files[0])}
            class="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded" />
          <p class="text-xs text-slate-500">Accepted file formats: PDF, DOC, and DOCX</p>

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
            <textarea 
              className="whitespace-pre-wrap bg-gray-100 p-4 rounded w-full h-96 font-['geistsans']"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />

            <PDFDownloadLink
            document={<CoverLetterPDF coverLetter={coverLetter} />}
            fileName="cover_letter.pdf"
            className="block"
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