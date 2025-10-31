import React, { useState } from 'react';

// ⚠️ Ensure this URL is correct after your successful Maven build and Tomcat deployment
const JAVA_API_URL = 'http://localhost:8080/feedback-api/submitFeedback'; 

function FeedbackForm() {
    const [formData, setFormData] = useState({ name: '', email: '', rating: '4', comments: 'Easy to use and ease of operation' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Submitting...');
        
        const urlEncodedData = new URLSearchParams(formData).toString();

        try {
            const response = await fetch(JAVA_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData,
            });

            const result = await response.json();

            if (response.ok) {
                // SUCCESS MESSAGE CHANGE
                setMessage('✅ Thank you for your feedback!');
                setFormData({ name: '', email: '', rating: '5', comments: '' });
            } else {
                // FAILURE MESSAGE CHANGE (from server response or generic error)
                setMessage('❌ Submission failed.');
            }
        } catch (error) {
            // NETWORK FAILURE MESSAGE CHANGE
            setMessage(`❌ Network Error: Submission failed.`);
            console.error('Feedback submission error:', error);
        }
    };

    /* --- STYLING CONSTANTS --- */

    // Outer container style for centering. Switched to light background.
    const centeredWrapperStyle = {
        background: '#f0f0f0', // Light gray background
        minHeight: '100vh', 
        height: '100%', 
        width: '100%',
        padding: '1px',
        display: 'flex',            // Enable Flexbox
        justifyContent: 'center',   // Center horizontally
        alignItems: 'center',       // Center vertically
    };

    const formContainerStyle = {
        background: '#ffffff', // White card background
        padding: '40px', 
        borderRadius: '8px',
        maxWidth: '500px', 
        width: '500px',    
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
        color: '#333', // Dark text
        fontFamily: 'Arial, sans-serif'
    };

    // Input fields are white with dark borders and dark text.
    const inputStyle = {
        padding: '15px', 
        margin: '12px 0', 
        border: '1px solid #ccc', // Lighter border
        borderRadius: '4px',
        background: '#ffffff', // White input background
        color: '#000000', // Black input text
        fontSize: '18px', 
        width: 'calc(100% - 30px)', 
        boxSizing: 'border-box'
    };
    
    // Select styling ensures native arrow is hidden
    const selectStyle = {
        ...inputStyle,
        WebkitAppearance: 'none', 
        MozAppearance: 'none',    
        appearance: 'none',
        backgroundImage: 'none', 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 15px top 50%',
        backgroundSize: '16px 16px'
    };

    const buttonStyle = {
        padding: '16px', 
        background: '#1a1a1a', // Dark, high-contrast button color
        color: '#fff', // White text on dark button
        border: '1px solid #1a1a1a', 
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px', 
        fontWeight: 'bold',
        transition: 'background 0.2s, border-color 0.2s',
        marginTop: '25px' 
    };
    
    const buttonHoverStyle = {
        background: '#333',
        borderColor: '#333'
    };
    
    const [isHovered, setIsHovered] = useState(false);

    // Dynamic color for message based on success/failure prefix
    const messageColor = message.startsWith('✅') ? '#007000' : '#d00000';

    return (
        // Apply the centering styles to the outer div
        <div style={centeredWrapperStyle}> 
            <div style={formContainerStyle}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '20px' }}>Library Feedback Form</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    
                    {/* Name Input */}
                    <input 
                        type="text" name="name" value={formData.name} onChange={handleChange} 
                        placeholder="Your Name" required style={inputStyle}
                    />

                    {/* Email Input */}
                    <input 
                        type="email" name="email" value={formData.email} onChange={handleChange} 
                        placeholder="Your Email" required style={inputStyle}
                    />

                    {/* Rating Select */}
                    <select 
                        name="rating" value={formData.rating} onChange={handleChange} 
                        required style={selectStyle}
                    >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Neutral</option>
                        <option value="2">2 - Needs Improvement</option>
                        <option value="1">1 - Poor</option>
                    </select>

                    {/* Comments Textarea */}
                    <textarea 
                        name="comments" value={formData.comments} onChange={handleChange} 
                        placeholder="Detailed Comments" required rows="4" style={inputStyle}
                    />

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        style={isHovered ? {...buttonStyle, ...buttonHoverStyle} : buttonStyle}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        Submit Feedback
                    </button>
                </form>
                {message && <p style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '18px', textAlign: 'center', color: messageColor }}>{message}</p>}
            </div>
        </div>
    );
}

export default FeedbackForm;
