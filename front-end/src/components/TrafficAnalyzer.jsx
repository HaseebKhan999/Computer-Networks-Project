import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Helper function is simplified to extract ONLY the Primary Activity text.
const formatSummary = (text) => {
    // Look for the line starting with the primary activity marker
    const primaryLine = text.split('\n').find(line => line.includes('**Primary Activity:**'));
    
    if (primaryLine) {
        // Remove markdown list marker, bolding markup, and the section title.
        // This leaves just the core analysis text.
        return primaryLine
            .replace(/[\*\-\s]+?\*\*Primary Activity:\*\*\s*/, '')
            .trim();
    }
    
    // Fallback if the strict format isn't followed
    return text.trim();
};

// --- Component Start ---

// Hardcoded Key for Canvas environment (replace with your actual key)
const genAI = new GoogleGenerativeAI("AIzaSyDiHPizMpTUXX7oltoQcHTzKD3w3IdfBI0");

const TrafficAnalyzer = () => {
    // Changed setSummary initial state to null for cleaner loading logic
    const [summary, setSummary] = useState(null); 
    const [loading, setLoading] = useState(false);
    
    // Packet state is now handled internally
    const [packets, setPackets] = useState([]);

    // Internal data fetching remains
    useEffect(() => {
        const interval = setInterval(() => {
            // NOTE: Using /api/packets/recent/ endpoint
            fetch("http://127.0.0.1:8000/api/packets/recent/", { method: "POST" })
                .then((res) => res.json())
                .then((data) => {
                    setPackets(data);
                });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const analyzeTraffic = async () => {
        if (!packets || packets.length === 0) {
            setSummary("No packet data available to analyze. Start capturing traffic.");
            return;
        }

        setLoading(true);
        setSummary("Analyzing traffic patterns..."); // Set temporary loading message

        try {
            // 2. Prepare the data
            // NOTE: Using p.dest_ip as confirmed by the user.
            const packetLog = packets.slice(0, 50).map(p => 
                `Time: ${p.timestamp}, Src: ${p.src_ip || 'N/A'}, Dst: ${p.dest_ip || 'MISSING_DST_IP'}, Proto: ${p.protocol}, App: ${p.app_layer || 'Unknown'}`
            ).join('\n');

            // 3. Construct the MODIFIED Prompt (Single Activity Focus)
            const prompt = `
                You are a highly skilled Network Security Analyst. Analyze the provided log of the last ${packets.length} network packets.
                
                IMPORTANT: The Destination IP is provided under the "Dst:" tag.
                
                Packet Log:
                ${packetLog}

                Your Goal: Provide a single, highly concise summary focused ONLY on the user's primary activity and immediate security observations. Do not use any introductory, concluding, or extra sentences.

                Format: You MUST use the following strict format for your ENTIRE response:
                
                * **Primary Activity:** [Your single, focused analysis here. Identify the main activity (e.g., Streaming, Social Media, Cloud Sync) and note any security anomalies or critical data limitations.]
            `;

            // 4. Call Gemini (with retry logic)
            let result;
            let response;
            let text = "Failed to generate content.";
            
            // Simple retry loop (optional, but good practice for API stability)
            for (let i = 0; i < 3; i++) {
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                    result = await model.generateContent(prompt);
                    response = await result.response;
                    text = response.text();
                    if (text) break; // Break if we get a response
                } catch (e) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // Exponential backoff
                }
            }
            
            setSummary(text);
        } catch (error) {
            console.error("Error calling Gemini:", error);
            setSummary("Error analyzing traffic. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate the single content string for rendering
    const contentString = summary && !loading && typeof summary === 'string' ? formatSummary(summary) : null;

    return (
        <div className="p-4 bg-white rounded-lg shadow-xl ml-3 mt-4 max-w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-extrabold text-gray-800">AI Traffic Insight</h3>
                <button 
                    onClick={analyzeTraffic}
                    disabled={loading || packets.length === 0}
                    className={`px-6 py-2 rounded-full text-white font-semibold transition duration-300 ${
                        loading || packets.length === 0
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-md hover:shadow-lg"
                    }`}
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
            </div>
            
            {/* Loading / Status message */}
            {loading && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mr-3"></div>
                    <span className="text-gray-600">Gemini is synthesizing network intelligence...</span>
                </div>
            )}
            
            {/* Single Summary Rendering */}
            {contentString && !loading && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-700 text-base">
                    <p>
                        <span className="font-bold text-blue-700 mr-2">Primary Activity:</span>
                        <span>{contentString}</span>
                    </p>
                </div>
            )}

            {/* Fallback for simple messages or errors */}
            {!loading && summary && !contentString && (
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-red-600 whitespace-pre-line">
                    Error parsing summary. Raw response: {summary}
                </div>
            )}
        </div>
    );
};

export default TrafficAnalyzer;
