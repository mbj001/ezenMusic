import React from 'react'
import SearchTrack from './SearchTrack'
import SearchArtist from './SearchArtist'
import SearchAlbum from './SearchAlbum'
import SearchTheme from './SearchTheme'
import SearchLyrics from './SearchLyrics'
import { RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
function SearchAll({keyward, handleRender}) {
  return (
    <>
    <SearchArtist keyward={keyward} page={"all"}/>
    <SearchTrack keyward={keyward} page={"all"} handleRender={handleRender}/>
    <SearchAlbum keyward={keyward} page={"all"} />
    <SearchTheme keyward={keyward} page={"all"} />
    <SearchLyrics keyward={keyward} page={"all"} />
    </>
  )
}

export default SearchAll