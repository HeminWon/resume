// src/Resume.tsx
import React, { useEffect, useState } from 'react';
import './Resume.css'; // 引入样式

interface ResumeData {
    basics: {
        name: string;
        label: string;
        email: string;
        phone: string;
        website: string;
        summary: string;
        location: {
            address: string;
            postalCode: number;
            city: string;
            countryCode: string;
            region: string;
        };
        profiles: {
            network: string;
            username: string;
            url: string;
        }[];
    };
    work: {
        company: string;
        position: string;
        website: string;
        startDate: string;
        endDate: string;
        summary: string;
        highlights: string[];
    }[];
    education: {
        institution: string;
        area: string;
        studyType: string;
        startDate: string;
        endDate: string;
        gpa: string;
        courses: string[];
    }[];
    skills: {
        name: string;
        level: string;
        keywords: string[];
    }[][];
}

const Resume: React.FC = () => {
    const [data, setData] = useState<ResumeData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/resume.json'); // 读取本地 JSON 文件
            const jsonData: ResumeData = await response.json();
            setData(jsonData);
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>; // 加载状态
    }

    return (
        <div className="container" id="cv">
            <div className="side">
                <div className="me">
                    <h1 id="username">{data.basics.name}</h1>
                    <h3 id="persona-tag">{data.basics.label}</h3>
                </div>
                <Profile education={data.education} />
                <Contact basics={data.basics} />
                <Skills skills={data.skills} />
            </div>
            <div className="main">
                <WorkExperience work={data.work} />
            </div>
        </div>
    );
};

const Profile: React.FC<{ education: ResumeData['education'] }> = ({ education }) => (
    <div className="profile info-unit">
        <h2 className="info-header">教育经历</h2>
        <hr />
        {education.map((edu, index) => (
            <div key={index}>
                <h2>{edu.institution}</h2>
                <h4>{edu.area}</h4>
                <h4>{edu.studyType}</h4>
                <h4>{edu.startDate} - {edu.endDate}</h4>
            </div>
        ))}
    </div>
);

const Contact: React.FC<{ basics: ResumeData['basics'] }> = ({ basics }) => (
    <div className="contact info-unit">
        <h2 className="info-header">联系方式</h2>
        <hr />
        <ul className="info-list">
            <li><label className="left-label">手机/微信:</label><span className="label-value">{basics.phone}</span></li>
            <li><label className="left-label">邮箱:</label><span className="label-value">{basics.email}</span></li>
            <li><label className="left-label">GitHub:</label><span className="label-value">{basics.website}</span></li>
        </ul>
    </div>
);

const Skills: React.FC<{ skills: ResumeData['skills'] }> = ({ skills }) => (
    <div className="skill info-unit">
        <h2 className="info-header">技能点</h2>
        <hr />
        {skills.map((skillGroup, index) => (
            <div key={index}>
                {skillGroup.map((skill, subIndex) => (
                    <div key={subIndex}>
                        <label className="left-label">{skill.name}</label>
                        <progress value={skill.level === "熟练" ? 80 : 50} max="100"></progress>
                    </div>
                ))}
            </div>
        ))}
    </div>
);

const WorkExperience: React.FC<{ work: ResumeData['work'] }> = ({ work }) => (
    <div className="work info-unit right-list">
        <h2 className="info-header">工作履历</h2>
        <hr />
        <ul className="experience-list">
            {work.map((job, index) => (
                <li key={index}>
                    <h3>{job.company} - {job.position} ({job.startDate} - {job.endDate})</h3>
                    <p>{job.summary}</p>
                    <ul>
                        {job.highlights.map((highlight, hiIndex) => (
                            <li key={hiIndex}>{highlight}</li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    </div>
);

export default Resume;