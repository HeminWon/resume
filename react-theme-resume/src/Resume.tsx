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
        duties: string[];
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

const formatDate = (dateString: string): string => {
    // 检查输入是否符合ISO 8601标准格式，尝试解析日期
    const date = new Date(dateString);

    // 如果不是有效日期（Date对象无法解析），返回原始输入
    if (isNaN(date.getTime())) {
        return dateString;
    }

    // 获取年份
    const year = date.getFullYear();

    // 获取月份，并确保为两位数
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // 返回格式化后的日期
    return `${year}.${month}`;
};

const formattedTimePeriod = (startDate: string, endDate: string): string => {
    const startStr = formatDate(startDate)
    const endStr = formatDate(endDate)
    return `${startStr} - ${endStr}`
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

const HeaderInfoItem: React.FC<{ label: string; value: string; href?: string }> = ({ label, value, href }) => (
    <div className="headerInfoItemContainer">
        <span className="headerInfoItemLabel">{label} :                 </span>
        {href ? (
            <a href={href} className="headerInfoItemDesc">
                {value}
            </a>
        ) : (
            <span className="headerInfoItemDesc">{value}</span>
        )}
    </div>
);

function HeaderComponent({ basics }: { basics: ResumeData["basics"] }) {
    return (
        <div className='headerInfoContainer'>
            {/* 左侧部分 */}
            <div className='headerInfoLeftContainer'>
                <h1 style={{ margin: '0', fontSize: '44px', marginRight: '10px' }}>{basics.name}</h1>
                <span style={{ fontSize: '22px', color: '#555', marginBottom: '3px' }}>{basics.label}</span>
            </div>

            {/* 右侧部分 */}
            <div className='headerInfoRightContainer'>
                <HeaderInfoItem label="邮箱" value={basics.email} href={`mailto:${basics.email}`} />
                <HeaderInfoItem label="手机" value={basics.phone} href={`tel:${basics.phone}`} />
                <HeaderInfoItem label="Github" value="HeminWon" href="https://github.com/HeminWon" />
                <HeaderInfoItem label="工作经验" value="三年" />
            </div>
        </div>
    );
}

function EducationComponent({ educations }: { educations: ResumeData["education"] }) {
    return (
        <div>
            <h2 className="sectionTitle">教育经历<span className="sectionLine"></span></h2>
            {educations.map((edu, index) => (
                <div key={index} className="workItemContainer">
                    <div className='workItemInfo'>
                        <div className='workItemInfoTitle'>
                            {edu.institution} {edu.area} {edu.studyType}
                        </div>
                        <div className="workItemInfoDate">
                            {formattedTimePeriod(edu.startDate, edu.endDate)}
                        </div>
                    </div>
                </div>
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
                            {formattedTimePeriod(work.startDate, work.endDate)}
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
                            {formattedTimePeriod(project.startDate, project.endDate)}
                        </div>
                    </div>
                    <div className='workItemInfo'>
                        主要职责:
                    </div>
                    <ul className="workItemDesc">
                        {project.duties.map((duty, dIndex) => (
                            <li key={dIndex}>{duty}</li>
                        ))}
                    </ul>
                    {/* 判断是否存在 project.highlights，只有存在时才渲染 "项目技术" */}
                    {project.highlights && project.highlights.length > 0 && (
                        <>
                            <div className='workItemInfo'>
                                项目技术:
                            </div>
                            <ul className="workItemDesc">
                                {project.highlights.map((highlight, hiIndex) => (
                                    <li key={hiIndex}>{highlight}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}

function SkillComponent({ skills }: { skills: ResumeData["skills"] }) {
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
