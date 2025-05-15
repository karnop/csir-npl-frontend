import React from 'react';
import Link from "next/link";

function Navbar() {
    return (
        <div className={"flex justify-between items-center py-2 px-8 w-full md:max-w-5xl md:mx-auto border-b border-gray-200 "}>
            {/*logo*/}
            <div className="flex gap-2 ">
                <h1 className="font-bold text-2xl">
                    <Link href={"/"}>AiDetect</Link>
                </h1>
            </div>

            {/*detect page*/}
            <div className="">
                <button className="bg-black text-white hover:opacity-80 p-2 px-6 rounded-md">
                    <Link href={"/diagnose"}>Diagnose</Link>
                </button>
            </div>
        </div>
    );
}

export default Navbar;