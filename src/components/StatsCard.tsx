import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: typeof LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  HaatDashoardStatus: number;
  dashboardType: string;
}

// Define mapping from color prop to light background color
const colorBgClasses: Record<string, string> = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  red: 'bg-red-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
};

const getChangeStyle = (changeType: string) => {
  switch (changeType) {
    case 'positive':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'negative':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'neutral':
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200';
  }
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  HaatDashoardStatus,
  dashboardType,
}) => {
  // Route handling
  let basePath = '';
  if (dashboardType === 'USER') {
    basePath = '/survey-details';
  } else if (
    dashboardType === 'MAKER' &&
    HaatDashoardStatus !== undefined &&
    HaatDashoardStatus !== null
  ) {
    basePath = '/maker-survey-details';
  } else if (
    dashboardType === 'ADMIN' &&
    HaatDashoardStatus !== undefined &&
    HaatDashoardStatus !== null
  ) {
    basePath = '/survey-details';
  }
  const destinationPath = `${basePath}?_hti=${HaatDashoardStatus}&title=${title}&dashboardType=${dashboardType}`;

  // Choose light card background based on color prop
  const lightCardBgClass = colorBgClasses[color] || 'bg-blue-50';

  return (
    <Link
      to={destinationPath}
      className={`
        group
        relative
        flex flex-col
        justify-between
        md:min-h-[210px] min-h-[180px]
        w-full
        rounded-xl
        shadow-lg
        p-6 sm:p-7
        transition transform duration-150
        hover:scale-[1.035]
        ${lightCardBgClass}
        overflow-hidden
        border border-slate-200
      `}
      style={{
        minWidth: 0,
        width: '100%',
        maxWidth: "100%",
      }}
    >
      {/* Remove overly white gradient overlay, keep card light color */}
      <div
        className="
          absolute inset-0
          pointer-events-none
          z-0
        "
      >
        {/* You may opt to add a subtle light pattern here if desired */}
        {/* For now, do not overwrite bg color with whiteish gradient */}
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`
              flex items-center justify-center
              h-12 w-12 min-w-12 min-h-12
              rounded-xl
              bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600
              shadow-md
            `}
          >
            <Icon className="w-6 h-6 text-white" />
          </span>
          <span
            className={`
              text-lg sm:text-xl
              font-bold
              uppercase
              bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600
              bg-clip-text text-transparent
              tracking-wide
            `}
          >
            {title}
          </span>
        </div>
        <div className="flex-1 flex items-end mt-2 mb-3">
          <span
            className="
              font-extrabold
              text-[2.1rem] sm:text-[2.5rem]
              leading-[1.1]
              drop-shadow-md
              bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600
              bg-clip-text text-transparent
            "
            style={{
              letterSpacing: '-.01em',
              wordBreak: 'break-word',
              // Medium card main value style
            }}
          >
            {value}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`
              inline-flex items-center gap-1 px-3 py-1 rounded-full 
              border text-sm font-semibold
              transition
              ${getChangeStyle(changeType)}
              shadow
            `}
          >
            {changeType === 'positive' && (
              <svg
                width={14}
                height={14}
                className="mr-1 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5 10l5-5 5 5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {changeType === 'negative' && (
              <svg
                width={14}
                height={14}
                className="mr-1 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 20 20"
              >
                <path
                  d="M15 10l-5 5-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {changeType === 'neutral' && (
              <svg
                width={9}
                height={9}
                className="mr-1 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <circle cx="10" cy="10" r="5" />
              </svg>
            )}
            <span>{change}</span>
          </span>
        </div>
      </div>
      {/* Subtle border */}
      <div className="
        pointer-events-none
        absolute inset-0
        border border-slate-300/20
        rounded-xl
        z-10
      " />
    </Link>
  );
};

export default StatsCard;