import React from 'react'
import SearchTrack from './SearchTrack'
import SearchArtist from './SearchArtist'
import SearchAlbum from './SearchAlbum'
import SearchTheme from './SearchTheme'
import SearchLyrics from './SearchLyrics'
function SearchAll({keyword, handleRender}) {
  return (
    <>
    <SearchArtist keyword={keyword} page={"all"} handleRender={handleRender}/>
    <SearchTrack keyword={keyword} page={"all"} handleRender={handleRender}/>
    <SearchAlbum keyword={keyword} page={"all"} handleRender={handleRender}/>
    <SearchTheme keyword={keyword} page={"all"} handleRender={handleRender}/>
    <SearchLyrics keyword={keyword} page={"all"} />
    </>
  )
}

export default SearchAll