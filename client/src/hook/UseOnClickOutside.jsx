import React from 'react';
import { useEffect } from 'react';
const UseOnClickOutside = (ref,handler) => {
    useEffect(() => {
        const listener = (event)=>{
        if(ref.current.contains(event.target)){
            return
        } else{
            handler();
        }
        };
        document.addEventListener('mousedown',listener)
        return () => {
        document.removeEventListener('mousedown',listener)
        };
    }, [ref,handler]);
}

export default UseOnClickOutside;