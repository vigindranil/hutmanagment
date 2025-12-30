import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: typeof LucideIcon;
  color: 'blue' | 'green' | 'red' | 'orange';
  HaatDashoardStatus: number;
  dashboardType: string;
}

const colorConfig: Record<string, { icon: string; text: string; iconBg: string; cardBg: string }> = {
  blue: {
    icon: 'bg-blue-500',
    text: 'text-slate-800',
    iconBg: 'bg-blue-50',
    cardBg: 'bg-gradient-to-br from-blue-200 via-blue-100 to-white'
  },
  green: {
    icon: 'bg-emerald-500',
    text: 'text-slate-800',
    iconBg: 'bg-emerald-50',
    cardBg: 'bg-gradient-to-br from-emerald-200 via-emerald-100 to-white'
  },
  red: {
    icon: 'bg-red-500',
    text: 'text-slate-800',
    iconBg: 'bg-red-50',
    cardBg: 'bg-gradient-to-br from-red-200 via-red-100 to-white'
  },
  orange: {
    icon: 'bg-orange-500',
    text: 'text-slate-800',
    iconBg: 'bg-orange-50',
    cardBg: 'bg-gradient-to-br from-orange-200 via-orange-100 to-white'
  },
};

const getChangeStyle = (changeType: string) => {
  switch (changeType) {
    case 'positive':
      return 'text-emerald-600';
    case 'negative':
      return 'text-red-600';
    case 'neutral':
    default:
      return 'text-slate-500';
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

  const colors = colorConfig[color] || colorConfig.blue;

  return (
    <Link
      to={destinationPath}
      className={`
        group
        relative
        flex flex-col
        md:min-h-[200px] min-h-[170px]
        w-full
        rounded-2xl
        border border-slate-200
        p-6
        transition-all duration-300 ease-out
        hover:shadow-xl hover:border-slate-300 hover:-translate-y-1
        overflow-hidden
        ${colors.cardBg}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.iconBg} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`w-6 h-6 ${colors.icon.replace('bg-', 'text-')}`} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </h3>
          <p className={`text-4xl font-bold ${colors.text} tracking-tight`}>
            {value}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          {changeType === 'positive' && (
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 17l5-5 5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {changeType === 'negative' && (
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 7l-5 5-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {changeType === 'neutral' && (
            <div className="w-2 h-2 rounded-full bg-slate-400" />
          )}
          <span className={`text-sm font-semibold ${getChangeStyle(changeType)}`}>
            {change}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StatsCard;




// import React from 'react';
// import { DivideIcon as LucideIcon } from 'lucide-react';
// import { Link } from 'react-router-dom';

// interface StatsCardProps {
//   title: string;
//   value: string;
//   change: string;
//   changeType: 'positive' | 'negative' | 'neutral';
//   icon: typeof LucideIcon;
//   color: 'blue' | 'green' | 'red' | 'orange';
//   HaatDashoardStatus: number;
//   dashboardType: string;
// }

// const colorConfig: Record<string, { icon: string; accent: string; gradient: string; label: string }> = {
//   blue: {
//     icon: 'text-blue-600',
//     accent: 'from-blue-600 to-cyan-500',
//     gradient: 'from-blue-50 via-white to-cyan-50',
//     label: 'text-blue-700'
//   },
//   green: {
//     icon: 'text-teal-600',
//     accent: 'from-teal-600 to-green-500',
//     gradient: 'from-teal-50 via-white to-green-50',
//     label: 'text-teal-700'
//   },
//   red: {
//     icon: 'text-rose-600',
//     accent: 'from-rose-600 to-pink-500',
//     gradient: 'from-rose-50 via-white to-pink-50',
//     label: 'text-rose-700'
//   },
//   orange: {
//     icon: 'text-amber-600',
//     accent: 'from-amber-600 to-orange-500',
//     gradient: 'from-amber-50 via-white to-orange-50',
//     label: 'text-amber-700'
//   },
// };

// const getChangeStyle = (changeType: string) => {
//   switch (changeType) {
//     case 'positive':
//       return 'text-emerald-600';
//     case 'negative':
//       return 'text-red-600';
//     case 'neutral':
//     default:
//       return 'text-slate-500';
//   }
// };

// const StatsCard: React.FC<StatsCardProps> = ({
//   title,
//   value,
//   change,
//   changeType,
//   icon: Icon,
//   color,
//   HaatDashoardStatus,
//   dashboardType,
// }) => {
//   let basePath = '';
//   if (dashboardType === 'USER') {
//     basePath = '/survey-details';
//   } else if (
//     dashboardType === 'MAKER' &&
//     HaatDashoardStatus !== undefined &&
//     HaatDashoardStatus !== null
//   ) {
//     basePath = '/maker-survey-details';
//   } else if (
//     dashboardType === 'ADMIN' &&
//     HaatDashoardStatus !== undefined &&
//     HaatDashoardStatus !== null
//   ) {
//     basePath = '/survey-details';
//   }
//   const destinationPath = `${basePath}?_hti=${HaatDashoardStatus}&title=${title}&dashboardType=${dashboardType}`;

//   const colors = colorConfig[color] || colorConfig.blue;

//   return (
//     <Link
//       to={destinationPath}
//       className={`
//         group
//         relative
//         flex flex-col
//         md:min-h-[220px] min-h-[190px]
//         w-full
//         rounded-3xl
//         border border-white/40
//         backdrop-blur-sm
//         p-7
//         transition-all duration-500 ease-out
//         hover:shadow-2xl hover:-translate-y-2
//         overflow-hidden
//         bg-gradient-to-br ${colors.gradient}
//       `}
//       style={{
//         background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))`,
//         backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%), linear-gradient(135deg, var(--tw-gradient-stops))`,
//       }}
//     >
//       <style>{`
//         @supports (background-image: linear-gradient(var(--angle), var(--color-1), var(--color-2))) {
//           .group:hover {
//             --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
//           }
//         }
//       `}</style>

//       <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${colors.accent} opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20 group-hover:scale-110`} />
//       <div className={`absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr ${colors.accent} opacity-5 blur-3xl transition-all duration-500 group-hover:opacity-15`} />

//       <div className="relative z-10 flex flex-col h-full">
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex-1">
//             <h3 className={`text-xs font-semibold ${colors.label} uppercase tracking-widest mb-3 opacity-80`}>
//               {title}
//             </h3>
//             <p className={`text-5xl font-black tracking-tighter ${colors.label}`} style={{ lineHeight: '1.1' }}>
//               {value}
//             </p>
//           </div>

//           <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.accent} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl flex-shrink-0 ml-4`}>
//             <Icon className="w-8 h-8 text-white" strokeWidth={2} />
//           </div>
//         </div>

//         <div className="mt-auto flex items-center gap-3 pt-5 border-t border-white/30">
//           <div className="flex items-center gap-2">
//             {changeType === 'positive' && (
//               <>
//                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
//                 <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M12 7a1 1 0 110-2h.01a1 1 0 110 2H12zm-3.976 1.9a.75.75 0 00-1.04 1.08l2.5 2.667a.75.75 0 001.04 0l2.5-2.667a.75.75 0 00-1.04-1.08L10 10.307l-1.976-1.407z" />
//                 </svg>
//               </>
//             )}
//             {changeType === 'negative' && (
//               <>
//                 <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
//                 <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M12 13a1 1 0 110 2h-.01a1 1 0 110-2H12zm-3.976-1.9a.75.75 0 00-1.04-1.08l-2.5 2.667a.75.75 0 001.04 1.08L10 9.693l1.976 1.407z" />
//                 </svg>
//               </>
//             )}
//             {changeType === 'neutral' && (
//               <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
//             )}
//           </div>
//           <span className={`text-sm font-bold ${getChangeStyle(changeType)}`}>
//             {change}
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default StatsCard;



