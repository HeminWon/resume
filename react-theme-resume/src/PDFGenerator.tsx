// PDFGenerator.tsx
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import Resume from './Resume'; // 确保导入你的简历组件
import { Document, Page } from '@react-pdf/renderer';

// 创建一个 PDF 文档组件
const MyDocument = () => (
  <Document>
    <Page size="A4">
      <Resume /> {/* 将你的简历组件放在这里 */}
    </Page>
  </Document>
);

// 生成 PDF 并下载
const PDFGenerator: React.FC = () => {
  const handleDownloadPdf = async () => {
    const blob = await pdf(<MyDocument />).toBlob(); // 生成 PDF Blob
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf'; // 指定下载文件名
    link.click(); // 自动点击链接以下载
    URL.revokeObjectURL(url); // 释放 URL 对象
  };

  return (
    <div>
      <button onClick={handleDownloadPdf}>下载 PDF</button>
    </div>
  );
};

export default PDFGenerator;
