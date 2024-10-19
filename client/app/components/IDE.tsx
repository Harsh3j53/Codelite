import React from 'react'
import { FileTreeDemo } from './Filetree'
import { Input } from '@/components/ui/input'



const IDE = () => {
    return (
        <div className='text-white  w-full  px-5 h-screen flex flex-row'>
            <FileTreeDemo />
            <div className='flex flex-col w-[80%] gap-4'>
                <Input className='dark border-gray-600 w-full bg-[#2c2c2c] h-[70%] overflow-scroll' />

                <div className='w-full h-[400px] mb-10  bg-black border border-gray-600 '></div>

            </div>
            <div className='flex flex-col gap-4'>
                <div className='w-[400px] h-[400px]  bg-[#18181B] ml-4'>
                </div>
                <div className='w-[400px] h-full mb-10 bg-[#18181B] ml-4'>
                </div>


            </div>
        </div>
    )
}

export default IDE