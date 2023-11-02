import React from "react";

const Kbd = ({ children }: { children: React.ReactNode }) => {
    return (
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border dark:border-[#444] bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
            {children}
        </kbd>
    );
};

export default Kbd;
