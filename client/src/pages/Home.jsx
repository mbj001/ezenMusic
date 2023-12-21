import React from 'react'
import MainBanner from '../card/MainBanner';
import MoodBanner from '../card/MoodBanner';
import SeasonBanner from "../card/SeasonBanner"
import GenreBanner from '../card/GenreBanner';
import MainStyledSection from '../layout/MainStyledSection';
import TodayReleaseBanner from '../card/TodayReleaseBanner';
const Home = ({handleRender}) => {
    return (
        <MainStyledSection>
            {/* MainStyledSection 으로 가운데 컨텐츠 섹션 만들었으니 여기 안에다가 쭉 뿌려주면 되고
            다른 페이지에서도 메인페이지처럼 양 옆 마진 들어가게 할 때 가져와서 사용하면 됨 */}
            <MainBanner handleRender={handleRender}/>
            <TodayReleaseBanner handleRender={handleRender}/>
            <MoodBanner handleRender={handleRender}/>
            <SeasonBanner handleRender={handleRender}/>
            <GenreBanner handleRender={handleRender}/>
        </MainStyledSection>
    )
}

export default Home

