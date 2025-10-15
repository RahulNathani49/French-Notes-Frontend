import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import '../index.css'; // Central CSS styling

function Home() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/student-register");
    };

    return (
        <Layout>
            <div>
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>Welcome to French Notes</h1>
                        <p>
                            Your all-in-one platform to master French for exams — with structured
                            reading, writing, listening, and speaking practice designed to help you
                            achieve top B1 and B2 scores.
                        </p>
                        <button className="cta-btn" onClick={handleGetStarted}>
                            Get Started
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features">
                    <h2>What You’ll Learn</h2>
                    <div className="feature-cards">
                        <div className="card">
                            <h3>Reading</h3>
                            <p>
                                Strengthen comprehension skills with authentic exam-style passages
                                and practice questions. <br />
                                <strong>Reading materials for upcoming sessions are being prepared — stay tuned!</strong>
                            </p>
                        </div>
                        <div className="card">
                            <h3>Writing</h3>
                            <p>
                                Master the art of French writing with structured examples and
                                templates tailored for <strong>B1 and B2 exam levels</strong>.
                                Learn how to organize your ideas and use correct expressions to
                                impress examiners.
                            </p>
                        </div>
                        <div className="card">
                            <h3>Listening</h3>
                            <p>
                                Sharpen your ear for French through short dialogues and real exam-like
                                listening clips. <br />
                                <strong>Listening exercises are currently being prepared and updated regularly.</strong>
                            </p>
                        </div>
                        <div className="card">
                            <h3>Speaking</h3>
                            <p>
                                Prepare confidently for speaking exams with ready-to-use dialogue
                                prompts, model recordings, and structured templates — ideal for
                                achieving B1 & B2 fluency benchmarks.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Exam Preparation Tips */}{/* Ideas Section */}
                <section className="exam-tips">
                    <h2>Ideas & Exam Question Bank</h2>
                    <div className="tips-cards">
                        <div className="tip-card">
                            <h3>Latest Exam Topics</h3>
                            <p>
                                Explore new and trending topics that have recently appeared in French exams.
                                Discover the kind of questions asked in <strong>B1 and B2</strong> writing and speaking tests.
                            </p>
                        </div>
                        <div className="tip-card">
                            <h3>Community Ideas</h3>
                            <p>
                                Read ideas submitted by other students — from sample essays to real-life exam experiences.
                                You can also share your own ideas, opinions, or creative writing pieces.
                            </p>
                        </div>
                        <div className="tip-card">
                            <h3>Files, Notes & Media</h3>
                            <p>
                                Access or upload useful resources like <strong>writing templates, sample recordings,
                                grammar sheets,</strong> or short videos to help others prepare effectively.
                            </p>
                        </div>
                        <div className="tip-card">
                            <h3>Interactive Practice</h3>
                            <p>
                                Use Ideas as a space to <strong>discuss exam-style prompts, ask questions,</strong> and
                                improve your responses by comparing them with others.
                            </p>
                        </div>
                    </div>
                </section>



            </div>
        </Layout>
    );
}

export default Home;
