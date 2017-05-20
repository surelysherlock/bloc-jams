
var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'     
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);

        var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        //var albumNumber = currentAlbum;

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            
            // $('.main-controls .play-pause').html(playerBarPlayButton);
            // currentlyPlayingSongNumber = null;
            // currentSongFromAlbum = null;
            if (currentSoundFile.isPaused()){
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            }else{
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        }
};

     var onHover = function(event){
         var $songNumberClass = $(this).find('.song-item-number');
         var $songNumber = parseInt($songNumberClass.attr('data-song-number'));
         
         if($songNumber !== currentlyPlayingSongNumber || currentSoundFile.isPaused()){
            $songNumberClass.html(playButtonTemplate);
         }else{
             $songNumberClass.html(pauseButtonTemplate);
         }
    };  

     var offHover = function(event){
         var $songNumberClass = $(this).find('.song-item-number');
         var $songNumber = parseInt($songNumberClass.attr('data-song-number'));
         
         if($songNumber !== currentlyPlayingSongNumber){
             $songNumberClass.html(songNumber);
         }else if($songNumber === currentlyPlayingSongNumber && currentSoundFile.isPaused() !== true){
             $songNumberClass.html(pauseButtonTemplate);
         }else{
             $songNumberClass.html(playButtonTemplate);
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
     var $albumReleaseInfo = $('.album-view-release-info');
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

 var setSong = function (songNumber) {
    if(currentSoundFile){
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum =  currentAlbum.songs[songNumber-1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3'],
        preload: true
    });

    setVolume(currentVolume);
 };

 var setVolume = function (volume){
     if(currentSoundFile){
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number= "' + number + '"]');
};

 var trackIndex = function(album, song){
     return album.songs.indexOf(song);
 };
 
 var nextSong = function (){
    //function
    var red = trackIndex(currentAlbum, currentSongFromAlbum);
    if(red === currentAlbum.songs.length-1){
        currentSongFromAlbum = currentAlbum.songs[0];
        var previousSongNumber = currentlyPlayingSongNumber;
        currentlyPlayingSongNumber = 1;  
        red = 0;
        updatePlayerBarSong();
        setSong(red + 1);
        currentSoundFile.play();
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        $('.song-item-number[data-song-number = "' + previousSongNumber + '"]').html(previousSongNumber);
    }else{
        currentSongFromAlbum = currentAlbum.songs[red+1];
        var previousSongNumber = currentlyPlayingSongNumber;
        currentlyPlayingSongNumber = red+2;        
        red++;
        updatePlayerBarSong();
        setSong(red + 1);
        currentSoundFile.play();
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        $('.song-item-number[data-song-number = "' + previousSongNumber + '"]').html(previousSongNumber);
    }
 };

 var previousSong = function(){
    var red = trackIndex(currentAlbum, currentSongFromAlbum);
    if(red === 0 || red === null){
        currentSongFromAlbum = currentAlbum.songs[currentAlbum.songs.length-1];
        var previousSongNumber = currentlyPlayingSongNumber;
        currentlyPlayingSongNumber = currentAlbum.songs.length;  
        updatePlayerBarSong();
        setSong(currentlyPlayingSongNumber);
        currentSoundFile.play();
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        $('.song-item-number[data-song-number = "' + previousSongNumber + '"]').html(previousSongNumber);
    }else if(red <0){
        currentSongFromAlbum = currentAlbum.songs[0];
        red =0;
        currentlyPlayingSongNumber = 1;
        updatePlayerBarSong();
        setSong(red +1);
        currentSoundFile.play();
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    }else{
        currentSongFromAlbum = currentAlbum.songs[red-1];
        var previousSongNumber = currentlyPlayingSongNumber;
        currentlyPlayingSongNumber = red;        
        red--;
        updatePlayerBarSong();
        setSong(red + 1);
        currentSoundFile.play();
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        $('.song-item-number[data-song-number = "' + previousSongNumber + '"]').html(previousSongNumber);
    }
 };

var updatePlayerBarSong = function (){
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>'; 
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });