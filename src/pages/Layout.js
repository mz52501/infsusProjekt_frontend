import {Outlet, Link} from "react-router-dom";

export default function Layout() {
    return (
        <>
            <nav className="flex items-center bg-gray-500">
                <Link to="/" className="text-stone-300 py-3 px-4 text-lg hover:bg-gray-700 focus:bg-gray-700">
                    <p className="item">Ispiti</p>
                </Link>
                <Link to="/predmeti" className="text-stone-300 py-3 px-4 text-lg hover:bg-gray-700 focus:bg-gray-700">
                    <p className="item" to="/subjects">Predmeti</p>
                </Link>
            </nav>
            <Outlet />
        </>
    )
}