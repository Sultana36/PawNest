import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import GlassFilters from "./Shared/GlassFilters";

const Root = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col">
            <GlassFilters />

            <div className="sticky top-0 z-50">
                <Header></Header>
            </div>

            <motion.main
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1"
            >
                <Outlet></Outlet>
            </motion.main>

            <Footer></Footer>
        </div>
    );
};

export default Root;