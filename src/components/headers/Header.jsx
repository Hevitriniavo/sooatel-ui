import { Link } from 'react-router-dom';
import { MdOutlineLightMode, MdNightlightRound } from "react-icons/md";
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import { useThemeStore } from '../../stores/useThemeStore';

export default function Header() {
    const isDark = useThemeStore(state => state.isDark);
    const toggleTheme = useThemeStore(state => state.toggleTheme);
    return (
        <header className={`fixed top-0 left-0 w-full h-20  ${isDark ? 'bg-gray-800' : 'bg-white'} p-4 shadow-md flex items-center justify-between lg:p-6`}>
            <div className='flex items-center gap-14 '>
                <Link to="/" className='flex items-center gap-2'>
                    <img src="/UTOPIA-B.png" alt="UTOPIA-B" className="w-12 h-12 lg:w-16 lg:h-16 rounded-full" />
                    <div className='hidden lg:flex flex-col'>
                        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-500'}`}>By Sooatel</span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ankasina Antananarivo <br /> Tél : 038 96 373 43</span>
                    </div>
                </Link>
                <Breadcrumb />
            </div>
            <div className='flex items-center gap-3'>
                <button
                    className="LightMode rounded-full p-3 bg-slate-100 text-2xl flex items-center justify-center hover:bg-slate-200"
                    onClick={toggleTheme}
                >
                    {isDark ? (
                        <MdNightlightRound className='Nightlight' />
                    ) : (
                        <MdOutlineLightMode />
                    )}
                </button>
            </div>
        </header>
    );
}
