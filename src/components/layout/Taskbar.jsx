import React from "react";
import portfolioLogo from "../../assets/logo.png";
import styles from "./Taskbar.module.css";

export const Taskbar = React.memo(function Taskbar({
  navItems,
  activeTab,
  onNavClick,
  isMobileNavOpen,
  onToggleMobileNav,
  connectDropdownRef,
  isConnectDropdownOpen,
  onToggleConnectDropdown,
  onCloseConnectDropdown,
  profileLinks,
  theme,
  onToggleTheme,
}) {
  return (
    <header className={`top-taskbar ${styles.taskbar}`}> 
      <div className="taskbar-brand">
        <img src={portfolioLogo} alt="Portfolio logo" className="taskbar-logo" />
        <span>Portfolio</span>
      </div>

      <button
        type="button"
        className="taskbar-mobile-toggle"
        aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileNavOpen}
        onClick={onToggleMobileNav}
      >
        {isMobileNavOpen ? "Close" : "Menu"}
      </button>

      <nav
        className={`taskbar-nav ${isMobileNavOpen ? "mobile-open" : ""}`}
        aria-label="Portfolio navigation"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`taskbar-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => onNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="taskbar-connect-wrap" ref={connectDropdownRef}>
        <button
          type="button"
          className={`theme-toggle-btn ${styles.themeBtn}`}
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-pressed={theme === "light"}
        >
          <span className="theme-icon" aria-hidden="true">
            {theme === "dark" ? "☾" : "☀"}
          </span>
        </button>

        <button
          type="button"
          className="taskbar-cta"
          aria-haspopup="menu"
          aria-expanded={isConnectDropdownOpen}
          onClick={onToggleConnectDropdown}
        >
          Let&apos;s Connect
        </button>

        {isConnectDropdownOpen ? (
          <div className="taskbar-connect-menu" role="menu">
            {profileLinks.map((profile) => (
              <a
                key={profile.id}
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                className="taskbar-connect-link"
                onClick={onCloseConnectDropdown}
              >
                {profile.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
});
