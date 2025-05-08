'use client';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';

const CoverLetterPDF = ({ coverLetter }) => {
  const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica' },
    content: { fontSize: 12, lineHeight: 1.5 },
  });

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.content}>{coverLetter}</Text>
      </Page>
    </Document>
  );
};

export default function PDFDownloader({ coverLetter }) {
  return (
    <PDFDownloadLink
      document={<CoverLetterPDF coverLetter={coverLetter} />}
      fileName="cover_letter.pdf"
      className="block mt-4"
    >
      {({ loading }) => (
        <button
          className={`w-full py-2 px-4 rounded-md text-white font-medium font-['comfortaa'] ${
            loading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-gray-600'
          } transition-colors`}
        >
          {loading ? 'Preparing PDF...' : 'Download as PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
