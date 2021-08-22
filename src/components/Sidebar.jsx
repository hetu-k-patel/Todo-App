import React from 'react';
import { FaRegCalendarAlt, FaRegCalendar, FaInbox, FaCheck } from 'react-icons/fa';

const Sidebar = ({ selectedTab, setSelectedTab }) => {
   return (
      <div className="sidebar">
         <div
            className={selectedTab === 'INBOX' ? 'active' : ''}
            onClick={() => setSelectedTab('INBOX')}
         >
            <FaInbox className="icon" />
            Inbox
         </div>
         <div
            className={selectedTab === 'TODAY' ? 'active' : ''}
            onClick={() => setSelectedTab('TODAY')}
         >
            <FaRegCalendarAlt className="icon" />
            Today
         </div>
         <div
            className={selectedTab === 'NEXT_7' ? 'active' : ''}
            onClick={() => setSelectedTab('NEXT_7')}
         >
            <FaRegCalendar className="icon" />
            Next 7 days
         </div>
         <div
            className={selectedTab === 'COMPLETED' ? 'active' : ''}
            onClick={() => setSelectedTab('COMPLETED')}
         >
            <FaCheck className="icon" />
            Completed
         </div>
      </div>
   );
};

export default Sidebar;
