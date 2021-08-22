import React from 'react';

const Header = () => {
   return (
      <header className="header">
         <nav>
            <div className="logo">
               <img
                  src="https://img.icons8.com/windows/50/000000/microsoft-to-do-app.png"
                  alt="logo"
               />{' '}
            </div>
            <h2>Todo App</h2>
         </nav>
      </header>
   );
};

export default Header;
