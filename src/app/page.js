'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { useRouter } from 'next/navigation';
import Landing from '@/components/ui/Landing';
import Features from '@/components/ui/Features';

export default function Home() {

  return (
    <div className="flex flex-col min-h-auto bg-white text-gray-800 font-['comfortaa']">
      <main >
        <Landing />
        <Features />
      </main>
    </div>
  );
}