import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useState } from "react";
import AppFooter from "components/layout/app.footer";


function Layout() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const location = useLocation();

    const isHomePage = location.pathname === "/";

    return (

        <div>
            <AppHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Outlet context={[searchTerm, setSearchTerm]}

            />
            {isHomePage && <AppFooter />}
        </div>

    );
}

export default Layout;
