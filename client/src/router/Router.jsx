import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Home from '../pages/Home';
import Browse from '../pages/Browse';
import Purchase from '../pages/Purchase';
import Storage from '../pages/Storage';
import NotFound from '../pages/NotFound';
import Voucher from '../components/Voucher';
import My from '../components/My';
import Promotion from '../components/Promotion';
import Coupon from '../components/Coupon';
import Detail from '../pages/Detail';
import Details from '../components/Details';
import Similar from '../components/Similar';
// import styled from 'styled-components';
import Player from '../layout/Player';
import Playlist from '../layout/Playlist';
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Find from '../pages/Find'
import Search from '../pages/Search';
import MyInfo from '../pages/MyInfo';
import ChangePassword from '../components/ChangePassword';
import ChangePhone from '../components/ChangePhone';
import EmailSignUp from '../components/EmailSignUp';
import KakaoSignUp from '../components/KakaoSignUp';
import Resister from '../components/Resister';
import ScrollToTop from '../components/ScrollTop';
// import PostTest from '../pages/PostTest';
import Likey from '../components/Likey';
import Mylist from '../components/Mylist';
import Character from '../pages/Character';
import Discovery from '../pages/Discovery';

const Router = () => {

    const [render, setRender] = useState(false);
    function handleRender(){
        setRender(render => {return !render});
    }
    
    return (
        <>
        <BrowserRouter>
            <Header/>
            <ScrollToTop />
            <Routes>
                <Route path='/' element={ <Home handleRender={handleRender}/> } />
                <Route path='/browse' element={ <Browse handleRender={handleRender}/> }>
                    <Route path=":genre_num" element={ <Browse handleRender={handleRender}/> } />
                </Route>
                <Route path="/detail">
                    <Route path=":track" element={<Detail handleRender={handleRender}/>}>
                        <Route path=":music_id" element={<Detail handleRender={handleRender}/>}>
                            <Route path=":details" element={<Detail handleRender={handleRender}/>} />
                            {/* <Route path=":similar" element={<Detail />} /> */}
                        </Route>
                    </Route>
                    {/* <Route path="album">
                        <Route path=":music_id" element={<Detail />} />
                    </Route> */}
                </Route>
                <Route path='/storage' element={<Storage />} >
                    <Route path='mylist' element={ <Mylist handleRender={handleRender}/> } /> 
                    <Route path=":storage_params" element={<Likey handleRender={handleRender}/>} />
                </Route>
                <Route path='/purchase' element={ <Purchase /> } >
                    <Route path='voucher' element={ <Voucher/> } />
                    <Route path='promotion' element={ <Promotion/> } />
                    <Route path='my' element={ <My/> } />
                    <Route path='coupon' element={ <Coupon/> } />
                    <Route path='*' element={ <NotFound /> } />
                </Route>
                
                <Route path='/signin' element={ <SignIn /> } />
                <Route exact path='/signup' element={ <SignUp /> } >
                    {/* <Route path='kakao' element={ <KakaoSignUp /> } /> */}
                </Route>
                <Route path='/signup/email' element={ <EmailSignUp /> } />
                <Route path='/signup/resister' element={ <Resister /> } />

                <Route path='/character' element={ <Character /> } />
                <Route path='/discovery' element={ <Discovery />} />

                <Route path='/find'>
                    <Route path='' element={ <Find findWhat={''}/> }/>
                    <Route path='id' element={ <Find findWhat={'id'}/> }/>
                    <Route path='password' element={ <Find findWhat={'password'}/> }/>
                    <Route path='*' element={ <NotFound /> }/>
                </Route>

                <Route path='/myinfo' element={ <MyInfo /> } >
                    <Route path='password' element={ <ChangePassword /> } />
                    <Route path='phone' element={ <ChangePhone/> } />
                </Route>

                <Route path='/search'>
                    <Route path=":search_params1" element={<Search handleRender={handleRender} />}>
                        {/* <Route path=":search_input" /> */}
                        
                    </Route>
                </Route>
                <Route path='*' element={ <NotFound /> } />
            </Routes>
            <Footer />
            {/* <PostTest /> */}
            {/* <LikeyBanner /> */}
            <Playlist handleRender={handleRender} render={render}/>
            {/* <Player /> */}
        </BrowserRouter>
        </>
    )
}


export default Router