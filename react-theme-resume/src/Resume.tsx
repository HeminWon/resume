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
    projects: {
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
    }[];
    about: {
        me: string[];
    };
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
                <ProjectComponent projects={data.projects} />
                <SkillComponent skills={data.skills} />
                <EvaluationComponent about={data.about} />
            </div>
        </div>
    );
};

function HeaderComponent({ basics }: { basics: ResumeData["basics"] }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
            {/* 左侧部分 */}
            <div className='headerInfo'>
                <h1 style={{ margin: '0', fontSize: '24px', marginRight: '10px' }}>{basics.name}</h1>
                <span style={{ fontSize: '18px', color: '#555' }}>{basics.label}</span>
            </div>

            {/* 右侧部分 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'space-between' }}>
                <div className="headerInfoItemContainer"><span className="headerInfoItemLabel">邮箱：</span><a href={`mailto:${basics.email}`} className="headerInfoItemDesc">{basics.email}</a></div>
                <div className="headerInfoItemContainer"><span className="headerInfoItemLabel">手机：</span><a href="tel:15957130984" className="headerInfoItemDesc">{basics.phone}</a></div>
                <div className="headerInfoItemContainer"><span className="headerInfoItemLabel">Github：</span><a href="https://github.com/HeminWon" className="headerInfoItemDesc">HeminWon</a></div>
                <div className="headerInfoItemContainer"><span className="headerInfoItemLabel">工作经验：</span><span className="headerInfoItemDesc">三年</span></div>
            </div>
        </div>
    );
}

function EducationComponent({ educations }: { educations: ResumeData["education"] }) {
    return (
        <div>
            <h2 className="sectionTitle">教育经历<span className="sectionLine"></span></h2>
            {educations.map((edu, index) => (
                <p key={index} className="educationItemContainer">
                    {edu.institution} {edu.area} {edu.studyType} <span className="workItemInfoDate">{edu.startDate} - {edu.endDate}</span>
                </p>
            ))}
        </div>
    );
}

function WorkComponent({ works }: { works: ResumeData["work"] }) {
    return (
        <div>
            <h2 className="sectionTitle">工作经历<span className="sectionLine"></span></h2>
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

function ProjectComponent({ projects }: { projects: ResumeData["projects"] }) {
    return (
        <div>
            <h2 className="sectionTitle">项目经验<span className="sectionLine"></span></h2>
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
    console.log(skills)
    return (
        <div>
            <h2 className="sectionTitle">技能描述<span className="sectionLine"></span></h2>
            {skills.map((item, index) => (
                <div className='skillItemInfo'>
                    <div className='skillItemInfoTitle'>
                        {`${item.name}: `}
                    </div>
                    <div className='skillItemInfoDesc'>
                       {item.keywords.join(',')} 
                    </div>
                </div>
            ))}
        </div>
    );
}

function EvaluationComponent({ about }: { about: ResumeData["about"] }) {
    return (
        <div>
            <h2 className="sectionTitle">工作期待&自我评价<span className="sectionLine"></span></h2>
            <ul className="workItemDesc">
                {about.me.map((evaluation, hiIndex) => (
                    <li key={hiIndex}>{evaluation}</li>
                ))}
            </ul>
        </div>
    )
}
export default Resume;
