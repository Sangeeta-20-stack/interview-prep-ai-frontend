import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
  role: '',
  experience: '',
  topicToFocus: '',
  numberOfQuestions: '',
  description: '',
});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
const handleCreateSession = async (e) => {
  e.preventDefault();
  const { role, experience, topicToFocus } = formData;

  if (!role || !experience || !topicToFocus) {
    setError('Please fill all the required fields.');
    return;
  }

  setError('');
  setIsLoading(true);

  try {
    const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
      role,
      experience,
      topicToFocus,
      numberOfQuestions: Number(formData.numberOfQuestions),
    });

    const generatedQuestions = aiResponse?.data;

    // ✅ Check response validity
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
      console.error('❌ No valid data from AI:', generatedQuestions);
      throw new Error('No valid questions generated from AI.');
    }

    console.log('✅ Generated Questions:', generatedQuestions);

    // Create session with those questions
    const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
      ...formData,
      questions: generatedQuestions,
    });

    console.log('✅ Session created:', response.data);

    const sessionId = response?.data?.session?._id;

    if (sessionId) {
      navigate(`/interview-prep/${sessionId}`);
    } else {
      throw new Error('Session creation failed: No session ID returned.');
    }
  } catch (error) {
    console.error('🚨 Error in session creation:', error);
    setError(error.message || 'Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="w-[90vw] md:w-[38vw] bg-white rounded-2xl p-8 shadow-xl">
      <h3 className="text-xl font-semibold text-black">Start a New Interview Journey</h3>
      <p className="text-sm text-slate-600 mt-2 mb-4">
        Fill out a few quick details and unlock your personalized set of interview questions!
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange('role', target.value)}
          label="Target Role"
          placeholder="(e.g., Frontend Developer, UI/UX Designer, etc.)"
          type="text"
        />

        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange('experience', target.value)}
          label="Years of Experience"
          placeholder="(e.g., 1 year, 3 years, 5+ years)"
          type="number"
        />

        <Input
          value={formData.topicToFocus}
          onChange={({ target }) => handleChange('topicToFocus', target.value)}
          label="Topics to Focus On"
          placeholder="Comma-separated, e.g., React, Node.js, MongoDB"
          type="text"
        />

        <Input
          value={formData.numberOfQuestions}
          onChange={({ target }) => handleChange('numberOfQuestions', target.value)}
          label="Number of Questions"
          placeholder="(e.g., 3)"
          type="number"
        />

        <Input
          value={formData.description}
          onChange={({ target }) => handleChange('description', target.value)}
          label="Description"
          placeholder="(Any specific goals or notes for this session)"
          type="text"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full mt-2 py-2.5 bg-black text-white rounded-md font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading && <SpinnerLoader />}
          Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
