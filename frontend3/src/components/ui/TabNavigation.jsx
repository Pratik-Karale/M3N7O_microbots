import React, { useState } from 'react';

import Icon from '../AppIcon';

const TabNavigation = ({ activeTab = 'generate', onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const tabs = [
    {
      id: 'generate',
      label: 'Generate',
      icon: 'Sparkles',
      path: '/presentation-generator'
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: 'Edit3',
      path: '/slide-editor'
    }
  ];

  const handleTabClick = (tab) => {
    setCurrentTab(tab?.id);
    if (onTabChange) {
      onTabChange(tab?.id);
    }
    window.location.href = tab?.path;
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="px-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => handleTabClick(tab)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-micro
                ${currentTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }
              `}
              aria-current={currentTab === tab?.id ? 'page' : undefined}
            >
              <Icon 
                name={tab?.icon} 
                size={16} 
                className={`
                  mr-2 transition-micro
                  ${currentTab === tab?.id 
                    ? 'text-primary' :'text-muted-foreground group-hover:text-foreground'
                  }
                `}
              />
              {tab?.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;