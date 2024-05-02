import React from "react";

export default function Loader(){
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="border-t-2 rounded-full dark:border-secondary border-primary-2 animate-spin aspect-square w-8"/>
        </div>
    )
}