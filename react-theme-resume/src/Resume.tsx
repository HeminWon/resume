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
            <div className="page">
                <HeaderComponent basics={data.basics} />
                <EducationComponent educations={data.education} />
                <WorkComponent works={data.work} />
                <ProjectComponent projects={data.project}/>
                <SkillComponent skills={data.skills} />
                {/* 技能描述部分 */}
                {/* 根据技能数据结构进行渲染 */}
                <h2 className="sectionTitle">工作期待&自我评价</h2>
                {/* 自我评价部分 */}
            </div>
        </div>
    );
};

function HeaderComponent({ basics }: { basics: ResumeData["basics"] }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px', borderBottom: '2px dashed #ccc' }}>
            {/* 左侧部分 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h1 style={{ margin: '0', fontSize: '24px' }}>{basics.name}</h1>
                <span style={{ fontSize: '18px', color: '#555' }}>{basics.label}</span>
            </div>

            {/* 右侧部分 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span>邮箱：<a href="mailto:heminwmh@gmail.com">{basics.email}</a></span>
                <span>手机：<a href="tel:15957130984">{basics.phone}</a></span>
                <span>Github：<a href="https://github.com/HeminWon" target="_blank" rel="noopener noreferrer">HeminWon</a></span>
                <span>工作经验：三年</span>
            </div>
        </div>
    );
}

function EducationComponent({ educations }: { educations: ResumeData["education"] }) {
    return (
        <div>
            <h2 className="sectionTitle">教育经历</h2>
            {educations.map((edu, index) => (
                <p key={index}>
                    {edu.institution} {edu.area} {edu.studyType} <span className="right">{edu.startDate} - {edu.endDate}</span>
                </p>
            ))}
        </div>
    );
}

function WorkComponent({ works }: { works: ResumeData["work"] }) {
    return (
        <div>
            <h2 className="sectionTitle">工作经历</h2>
            {works.map((work, index) => (
                <div key={index} className="workItemContainer">
                    <div className="workItemInfo">
                        <div className="workItemInfoTitle">
                            {work.company} - <span className="workItemInfoTitleDesc">{work.position}</span>
                        </div>
                        <div className="workItemInfoDate">
                            {work.startDate} ～ {work.endDate}
                        </div>
                    </div>
                    <ul className="workItemDesc">
                        {work.highlights.map((highlight, hiIndex) => (
                            <li key={hiIndex}>{highlight}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

function ProjectComponent({ projects }: { projects: ResumeData["project"] }) {
    return (
        <div>
            <h2 className="sectionTitle">项目经验</h2>
            {projects.map((project, index) => (
                <div key={index} className="workItemContainer">
                    <div className="workItemInfo">
                        <div className="workItemInfoTitle">
                            {project.name}
                        </div>
                        <div className="workItemInfoDate">
                            {project.startDate} ～ {project.endDate}
                        </div>
                    </div>
                    <ul className="workItemDesc">
                        {project.highlights.map((highlight, hiIndex) => (
                            <li key={hiIndex}>{highlight}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

function SkillComponent({ skills }: { skills: ResumeData["skills"] }) {
    return (
        <div>
            <h2 className="sectionTitle">技能描述</h2>
            {skills.map((skill, index) => (
                <div className='workItemInfo'>
                    <div className='workItemInfoTitle'>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Resume;
