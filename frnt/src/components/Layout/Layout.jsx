import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        {children}
         {/* this data is coming from App */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
