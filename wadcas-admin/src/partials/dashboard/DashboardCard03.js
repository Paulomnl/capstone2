import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import Icon from '../../images/icon-03.svg';
import EditMenu from '../EditMenu';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard03() {


  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-gray-200">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={Icon} width="32" height="32" alt="Icon 03" />
        </header>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Users</h2>
        <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Total</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 mr-2">Total users: 56</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard03;
