"use client";

import { useState } from 'react';

// Define the expected structure of a similar item
interface SimilarItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  similarity: number;
}

// Define the expected structure of the API response data
interface SimilarData {
  similarItems: SimilarItem[];
  aiDescription: string;
}

export default function SimilarityTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<SimilarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to convert a File object to a Base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // The result is usually "data:image/jpeg;base64,..."
        // We only want the base64 part for the API
        const base64String = reader.result as string;
        const [_, base64] = base64String.split(',');
        resolve(base64);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setData(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // 1. Convert File to Base64
      const base64String = await fileToBase64(file);

      // 2. Send Base64 to API route
      const response = await fetch( "/api/ai/similarity", { // 💡 Update this URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the raw base64 string directly in the body as expected by your API
        body: JSON.stringify(base64String), 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      // 3. Process and display results
      const resultData: SimilarData = await response.json();
      setData(resultData);

    } catch (err) {
      console.error(err);
      setError((err as Error).message || "An unknown error occurred during processing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 Image Similarity Test</h1>
      <p>Test your API endpoint by uploading an image. Your component will convert it to Base64 and send it for similarity search.</p>
      
      <hr style={{ margin: '20px 0' }} />

      {/* Input Controls */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={loading}
        />
        <button 
          onClick={handleSubmit} 
          disabled={loading || !file}
          style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Processing...' : 'Find Similar Items'}
        </button>
      </div>

      {/* Status and Errors */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}
      {file && <p>Selected File: <strong>{file.name}</strong></p>}

      <hr style={{ margin: '20px 0' }} />
      
      {/* Results */}
      {data && (
        <>
          <h2>✨ AI Analysis & Similar Items</h2>
          <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <strong>AI Description:</strong> 
            <p>{data.aiDescription}</p>
          </div>

          <h3>Top {data.similarItems.length} Similar Items:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            {data.similarItems.map((item) => (
              <div key={item.id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', textAlign: 'center' }}>
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '3px', marginBottom: '10px' }} 
                />
                <p style={{ fontWeight: 'bold' }}>{item.name}</p>
                <p style={{ fontSize: '0.9em', color: '#555' }}>Sim: {(item.similarity * 100).toFixed(2)}%</p>
                {/* <p style={{ fontSize: '0.8em' }}>{item.description.substring(0, 50)}...</p> */}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}