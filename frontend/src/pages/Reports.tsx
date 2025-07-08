import React, { useState, useEffect } from "react";
import ReportsTab from "../components/reports/ReportsTab";
import { useTranslation } from 'react-i18next';
import { useDashboardData } from "../hooks/useDashboardData";

const Reports = () => {
  const { t } = useTranslation();
  const { dateRange, selectedChannels } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportsTab 
          dateRange={dateRange}
          selectedChannels={selectedChannels}
        />
      </div>
    </div>
  );
};

export default Reports; 