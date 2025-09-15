import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
        <Icon name="Presentation" size={20} color="white" />
      </div>
      <span className="text-xl font-semibold text-foreground">PresentationCraft</span>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <Logo />
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={location?.pathname === '/presentation-generator' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => window.location.href = '/presentation-generator'}
              className="transition-micro"
            >
              Generate
            </Button>
            <Button
              variant={location?.pathname === '/slide-editor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => window.location.href = '/slide-editor'}
              className="transition-micro"
            >
              Edit
            </Button>
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Export
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              iconName="Settings"
              className="transition-micro hover:bg-accent"
            />
            
            <Button
              variant="ghost"
              size="icon"
              iconName="User"
              className="transition-micro hover:bg-accent"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;