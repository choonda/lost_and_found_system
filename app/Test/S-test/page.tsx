"use client";

import React, { useState, useRef } from "react";

const SubmitItemTest = () => {
  // Define the initial state structure for the form
  const initialFormData = {
    type: "Lost" as "Lost" | "Found",
    name: "",
    location: "",
    description: "",
    date: "",
    centerId: "",
    photo: null as File | null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to access the file input DOM element

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, photo: null });
    }
  };
  
  // Function to reset all form fields and state
  const resetForm = (message?: string) => {
    // 1. Reset React state (clears text fields)
    setFormData(initialFormData);
    // 2. Manually reset the file input element (clears selected photo)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // 3. Set the status message
    setError(message || null);
    setResponse(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData();
    
    // Check if photo is present since it's required by the API route
    if (!formData.photo) {
        setError("Photo is required.");
        return;
    }

    // Append all form data
    (Object.keys(initialFormData) as (keyof typeof initialFormData)[]).forEach((key) => {
      const value = formData[key];
      if (value !== null) {
        if (key === 'photo' && value instanceof File) {
          form.append(key, value);
        } else if (key !== 'photo') {
           form.append(key, String(value));
        }
      }
    });
    
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        body: form,
      });

      console.log("API Response Status:", res.status);

      // --- CRITICAL BLOCK: 403 Sensitive Content Handler ---
      if (res.status === 403) {
        const errorText = await res.text();
        const message = `Submission blocked due to policy violation: ${errorText}. Please revise the form fields.`;
        
        // **ACTION:** Reset form fields and state, and display the error message
        resetForm(message); 
        return; 
      }
      
      // --- Handle other non-403 responses ---
      
      if (!res.ok) {
        // Handle all other API errors (400, 500, etc.)
        const errorBody = await res.text(); 
        throw new Error(`API Error ${res.status}: ${errorBody}`);
      }
      
      // Response is 200 OK
      const data = await res.json();

      // Check for Similarity response (early exit in route.ts returns 200 with similarItems)
      if (data.similarItems && data.similarItems.length > 0) {
        // This is the similarity response, prompt the user for confirmation (simulated here)
        setError(`Similarity found! Items: ${data.similarItems.map((i: any) => i.name).join(', ')}. Please confirm or revise.`);
        setResponse(data);
      } else {
        // Final Success (Item created)
        setResponse(data);
        setError("Item submitted successfully! (Final Creation)");
        resetForm(); // <-- RESET FORM ON FINAL SUCCESS
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setResponse(null);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Submit Item Test</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Type:</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Center ID (Required for Found):</label>
          <input
            type="text"
            name="centerId"
            value={formData.centerId}
            onChange={handleChange}
            required={formData.type === 'Found'}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-1">Photo (Required):</label>
          <input 
            type="file" 
            name="photo" 
            onChange={handleFileChange} 
            ref={fileInputRef} 
            accept="image/*"
            className="p-2 border border-gray-300 rounded-md file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition duration-150"
        >
          Submit Item (POST)
        </button>
      </form>

      {/* Response and Error Display */}
      <div className="mt-8 space-y-4">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <h2 className="font-bold">Submission Status</h2>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <h2 className="font-bold">API Response (Received)</h2>
            <pre className="mt-2 p-3 bg-white border rounded-md overflow-x-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitItemTest;