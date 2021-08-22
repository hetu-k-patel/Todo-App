import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Tasks from './Tasks';

const Content = () => {
   const [selectedTab, setSelectedTab] = useState('INBOX');

   return (
      <section className="content">
         <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
         <Tasks selectedTab={selectedTab} />
      </section>
   );
};

export default Content;
