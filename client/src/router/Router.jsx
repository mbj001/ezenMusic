import React from 'react';
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
// import PostTest from '../pages/PostTest';


const Router = () => {
    return (
        <BrowserRouter>
            <Header />
                <Routes>
                    <Route path='/' element={ <Home /> } />
                    <Route path='/browse' element={ <Browse /> }>
                        <Route path=":genre_num" element={ <Browse /> } />
                    </Route>
                    <Route path="/detail">
                        <Route path=":track" >
                            <Route path=":music_id" element={<Detail />}>
                                <Route path=":details" element={<Detail />} />
                                {/* <Route path=":similar" element={<Detail />} /> */}
                            </Route>
                        </Route>
                        {/* <Route path="album">
                            <Route path=":music_id" element={<Detail />} />
                        </Route> */}
                    </Route>
                    <Route path='/storage' element={ <Storage /> } />
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

                    <Route path='/find'>
                        <Route path='' element={ <Find findWhat={''}/> }/>
                        <Route path='id' element={ <Find findWhat={'id'}/> }/>
                        <Route path='password' element={ <Find findWhat={'password'}/> }/>
                        <Route path='*' element={ <NotFound /> }/>
                    </Route>

                    <Route path='/myinfo' element={ <MyInfo /> } >
                        <Route path='password' element={ <ChangePassword/> } />
                        <Route path='phone' element={ <ChangePhone/> } />
                    </Route>

                    <Route path='/search'>
                        <Route path=":search_params1" element={<Search />}>
                            {/* <Route path=":search_input" /> */}
                            
                        </Route>
                    </Route>
                    <Route path='*' element={ <NotFound /> } />
                </Routes>
                <Footer />
            {/* <PostTest /> */}
            <Playlist />
            {/* <Player /> */}
        </BrowserRouter>
    )
}


export default Router