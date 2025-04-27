import './loader.css'

export default function Loader() {
    return (
        <div id="loader" style={{ transition: '0.5s' }} className="select-none w-screen h-screen absolute top-0 right-0 bg-[#dddddd] z-[2147483647] flex items-center justify-center">
            <div className="loader"></div>
            <span className="absolute translate-y-20 opacity-50 font-mono">Loading</span>
        </div>
    );
}