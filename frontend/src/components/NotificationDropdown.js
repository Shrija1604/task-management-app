import React, { useState, useEffect, useRef } from "react";
import API from "../services/api";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notification-wrapper" ref={dropdownRef} style={{ position: "relative", marginLeft: "auto", display: "flex", alignItems: "center" }}>
      <button 
        className="notification-bell" 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          position: "relative",
          color: "var(--text-primary)",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            background: "var(--accent-primary, #7c3aed)",
            color: "white",
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 8px var(--accent-primary, #7c3aed)"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="notification-dropdown"
          style={{
            position: "absolute",
            top: "45px",
            left: "45px",
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 1000,
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "15px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>Notifications</h3>
            {unreadCount > 0 && (
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{unreadCount} unread</span>
            )}
          </div>
          
          <div style={{ padding: "10px 0" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                  style={{
                    padding: "12px 15px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: notif.isRead ? "transparent" : "rgba(124, 58, 237, 0.05)",
                    cursor: notif.isRead ? "default" : "pointer",
                    display: "flex",
                    gap: "10px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => { if (!notif.isRead) e.currentTarget.style.background = "rgba(124, 58, 237, 0.1)"}}
                  onMouseLeave={(e) => { if (!notif.isRead) e.currentTarget.style.background = "rgba(124, 58, 237, 0.05)"}}
                >
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: notif.isRead ? "transparent" : "var(--accent-primary, #7c3aed)",
                    marginTop: "6px",
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: notif.isRead ? "500" : "600", color: "var(--text-primary)", marginBottom: "4px" }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                      {notif.message}
                    </div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "6px" }}>
                      {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
