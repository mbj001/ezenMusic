import React from 'react'
import { useParams } from 'react-router-dom'
import Track from '../components/Track';
import Album from '../components/Album';
import Channel from '../components/Channel';
import Chart from '../components/Chart';
import Artist from "../components/Artist";
import DetailMylist from '../components/DetailMylist';
import Recommend from '../components/Recommend';

function Detail({handleRender}) {
    
    const {track, music_id, details} = useParams();

    if(track === "track"){
        return (
            <Track music_id={music_id} details={details} handleRender={handleRender}/>
        )
    }
    else if(track === "album"){
        return (
            <Album album_id={music_id} details={details} handleRender={handleRender}/>
        )
    }
    else if(track === "channel"){
        return (
            <Channel themeplaylist_id={music_id} details={details} handleRender={handleRender}/>
        )
    }
    else if(track === "chart"){
        return (
            <Chart genre_id={music_id} handleRender={handleRender}/>
        )
    }
    else if(track === "artist") {
        return (
            <Artist  details={details} music_id={music_id} handleRender={handleRender}/>
        )
    }
    else if(track === "detailmylist"){
        return (
            <DetailMylist playlist_id={music_id} handleRender={handleRender}/>
        )
    }
    else if(track === "recommend"){
        return (
            <Recommend _id={music_id} handleRender={handleRender}/> 
        )
    }
    
}



export default Detail

