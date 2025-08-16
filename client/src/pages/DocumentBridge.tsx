/**
 * Document Bridge Page (Patch 006)
 * 
 * Full page interface for DocumentMatcher Bridge management
 * Provides comprehensive document linking interface with status monitoring
 */

import React from 'react';
import Layout from '../components/Layout';
import DocumentBridge from '../components/DocumentBridge';

const DocumentBridgePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <DocumentBridge />
      </div>
    </Layout>
  );
};

export default DocumentBridgePage;
