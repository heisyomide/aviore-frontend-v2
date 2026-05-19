'use client';

interface StoreTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  'Home',
  'Products',
  'New Arrivals',
  'Best Sellers',
  'Reviews',
  'About',
];

export function StoreTabs({
  activeTab,
  setActiveTab,
}: StoreTabsProps) {
  return (
    <div className="sticky top-[72px] z-30 bg-white border-y border-zinc-100">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-8 px-5 min-w-max h-14">
          {tabs.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative
                  h-full
                  text-sm
                  font-black
                  tracking-tight
                  whitespace-nowrap
                  transition-all
                  duration-300
                  ${
                    active
                      ? 'text-[#A4143D]'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }
                `}
              >
                {tab}

                {active && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      w-full
                      h-[3px]
                      rounded-full
                      bg-[#A4143D]
                    "
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}