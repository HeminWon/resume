// src/Resume.tsx
import React, { useEffect, useState } from 'react';
import './Resume.css';

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
    project: {
        name: string;
        startDate: string;
        endDate: string;
        description: string;
        highlights: string[];
        url: string;
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
            const response = await fetch('/resume.json');
            const jsonData: ResumeData = await response.json();
            setData(jsonData);
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="sidebar">
                <h1>{data.basics.name}</h1>
                <h2>{data.basics.label}</h2>
                <ul>
                    <li><span>邮箱:</span> <a href={`mailto:${data.basics.email}`}>{data.basics.email}</a></li>
                    <li><span>手机:</span> <a href={`tel:${data.basics.phone}`}>{data.basics.phone}</a></li>
                    <li><span>Github:</span> <a href={data.basics.website}>{data.basics.website}</a></li>
                    <li><span>工作经验:</span> 三年</li>
                </ul>
            </div>
            <div className="page">
                <h2 className="sectionTitle">教育经历</h2>
                {data.education.map((edu, index) => (
                    <p key={index}>
                        {edu.institution} {edu.area} {edu.studyType} <span className="right">{edu.startDate} - {edu.endDate}</span>
                    </p>
                ))}
                <h2 className="sectionTitle">工作经历</h2>
                {data.work.map((job, index) => (
                    <div key={index} className="workItemContainer">
                        <div  className="workItemInfo">
                            <div className="workItemInfoTitle">
                                {job.company} - <span className="workItemInfoTitleDesc">{job.position}</span>
                            </div>
                            <div className="workItemInfoDate">
                             {job.startDate} ～ {job.endDate}
                            </div>
                        </div>
                        <ul className="workItemDesc">
                            {job.highlights.map((highlight, hiIndex) => (
                                <li key={hiIndex}>{highlight}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                <h2 className="sectionTitle">项目经验</h2>
                {/* 项目经验部分 */}
                {/* 根据项目数据结构进行渲染 */}
                <h2 className="sectionTitle">技能描述</h2>
                {/* 技能描述部分 */}
                {/* 根据技能数据结构进行渲染 */}
                <h2 className="sectionTitle">工作期待&自我评价</h2>
                {/* 自我评价部分 */}
            </div>
        </div>
    );
};

export default Resume;
