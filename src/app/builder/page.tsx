'use client';

import BuilderPanel from '@/components/builder/BuilderPanel';

export default function BuilderPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Builder Tools</h1>
        <p className="text-text-secondary text-sm">
          Build, integrate, and earn rewards with prediction market APIs
        </p>
      </div>
      <BuilderPanel />
    </div>
  );
}
