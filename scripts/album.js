
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'     
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);

    //  var clickHandler = function(){
    //     var $songNumber = $(this).attr('data-song-number');

    // if(currentlyPlayingSong === null) {
    //     $songNumberClass.html(pauseButtonTemplate);
    //     currentlyPlayingSong = $songNumber;
    // }else if(currentlyPlayingSong === $songNumber){
    //     $songNumberClass.html(playButtonTemplate);
    //     currentlyPlayingSong = null;
    // }else if(currentlyPlayingSong !== $songNumber){
    //     var currentlyPlayingSongElement = $('[data-song-number="'+ currentlyPlayingSong + '"]');
    //     currentlyPlayingSongElement.html(currentlyPlayingSongElement.attr('data-song-number'));
    //     $songNumberClass.html(pauseButtonTemplate);
    //     currentlyPlayingSong = $songNumber;
    // }

        var clickHandler = function() {
        var songNumber = $(this).attr('data-song-number');
        //var albumNumber = currentAlbum;

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            //currentSongFromAlbum = albumNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber-1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
};
     var onHover = function(event){
         var $songNumberClass = $(this).find('.song-item-number');
         var $songNumber = $songNumberClass.attr('data-song-number');
         
         if($songNumber !== currentlyPlayingSongNumber){
            $songNumberClass.html(playButtonTemplate);
         }
    };  

     var offHover = function(event){
         var $songNumberClass = $(this).find('.song-item-number');
         var $songNumber = $songNumberClass.attr('data-song-number');
         
         if($songNumber !== currentlyPlayingSongNumber){
             $songNumberClass.html(songNumber);
         }
     };
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var setCurrentAlbum = function(album) {
    currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info')
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song){
     return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function (currentAlbum){
     $('.song-name').textcontent = currentAlbum.songs.title;
     $('.artist-song-mobile').textcontent = currentAlbum.songs.title + " - " + currentAlbum.artist;
     $('.artist-name').textcontent = currentAlbum.artist;
     $('.main-controls .play-pause').html(playerBarPauseButton);
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>'; 
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
 });