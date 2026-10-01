'use client';

import React, { useState, ReactNode } from 'react';

interface TabItemProps {
  label: string;
  id?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function TabItem({ children }: TabItemProps) {
  return <div>{children}</div>;
}

interface TabsProps {
  children: React.ReactElement<TabItemProps>[] | React.ReactElement<TabItemProps>;
  defaultIndex?: number;
}

export function Tabs({ children, defaultIndex = 0 }: TabsProps) {
  const items = React.Children.toArray(children) as React.ReactElement<TabItemProps>[];
  const [activeTab, setActiveTab] = useState(defaultIndex);

  if (!items || items.length === 0) return null;

  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-2 pt-2 gap-1 overflow-x-auto">
        {items.map((item, index) => {
          const isActive = index === activeTab;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-lg transition-all duration-150 border-t-2 ${
                isActive
                  ? 'border-orange-500 bg-white dark:bg-[#0c121e] text-orange-600 dark:text-orange-400 font-semibold shadow-xs'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              {item.props.icon && <span className="opacity-80">{item.props.icon}</span>}
              <span>{item.props.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {items[activeTab] ? items[activeTab].props.children : null}
      </div>
    </div>
  );
}
