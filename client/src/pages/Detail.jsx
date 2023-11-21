import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios';
import styled from 'styled-components';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";
import Details from '../components/Details';
import Similar from '../components/Similar';
import Track from '../components/Track';
import Album from '../components/Album';
import Channel from '../components/Channel';
import Chart from '../components/Chart';
import Artist from "../components/Artist";
import DetailMylist from '../components/DetailMylist';

function Detail() {
    
    const {track, music_id, details} = useParams();

    if(track === "track"){
        return (
            <Track music_id={music_id} details={details} />
        )
    }
    else if(track === "album"){
        return (
            <Album album_id={music_id} details={details} />
        )
    }
    else if(track === "channel"){
        return (
            <Channel num={music_id} details={details} />
        )
    }
    else if(track === "chart"){
        return (
            <Chart genre_id={music_id} />
        )
    }
    else if(track === "artist") {
        return (
            <Artist  details={details} music_id={music_id}/>
        )
    }
    else if(track === "detailmylist"){
        return (
            <DetailMylist playlist_id={music_id} />
        )
    }
    
}



export default Detail

