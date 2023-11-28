import React from "react";

/**
 * Tabs component.
 */
const Tabs = ({ children }: { children: React.ReactNode }) => {
    return <nav className="flex mb-[-2px]">{children}</nav>;
};

export default Tabs;
