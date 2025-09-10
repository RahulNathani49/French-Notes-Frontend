import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

import '../index.css'; // central CSS for styling

function Home() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/student-register"); // redirect to student register route
    };
    return (


        <Layout>


            <div>
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>Welcome to French Notes</h1>
                        <p>Your ultimate platform to master French for exams with reading, writing, listening, and
                            speaking practice.</p>
                        <button className="cta-btn" onClick={handleGetStarted}>Get Started</button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features">
                    <h2>What You’ll Learn</h2>
                    <div className="feature-cards">
                        <div className="card">
                            <h3>Reading</h3>
                            <p>Practice comprehension with exam-level passages and questions.</p>
                        </div>
                        <div className="card">
                            <h3>Writing</h3>
                            <p>Learn essay and short-answer formats with examples and templates.</p>
                        </div>
                        <div className="card">
                            <h3>Listening</h3>
                            <p>Improve your listening skills with audio exercises and transcripts.</p>
                        </div>
                        <div className="card">
                            <h3>Speaking</h3>
                            <p>Prepare for speaking exams with dialogues, prompts, and recordings.</p>
                        </div>
                    </div>
                </section>

                {/* Exam Preparation Tips */}
                <section className="exam-tips">
                    <h2>Exam-Based Preparation</h2>
                    <div className="tips-cards">
                        <div className="tip-card">
                            <h3>Timed Mock Exams</h3>
                            <p>Improve speed and accuracy with realistic timed exercises.</p>
                        </div>
                        <div className="tip-card">
                            <h3>Sample Questions & Model Answers</h3>
                            <p>Access high-quality examples to understand what examiners expect.</p>
                        </div>
                        <div className="tip-card">
                            <h3>Step-by-Step Guidance</h3>
                            <p>Get structured guidance for all exam sections to boost your score.</p>
                        </div>
                    </div>
                </section>

            </div>
        </Layout>
    );
}


export default Home;
