import React from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import FindId from '../components/FindId';
import FindPassword from '../components/FindPassword';

const Find = (props) => {
    const findWhat = props.findWhat;

    return (
        <MainStyledSection>
            {
                findWhat === 'id' ? 
                <FindId />
                : findWhat === 'password' ? 
                <FindPassword />                
                : 
                <div>
                    접근금지
                </div>
            }
        </MainStyledSection>
        
    )
}

export default Find