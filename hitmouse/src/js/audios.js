/**
 * 音频资源列表
 */
function getAudioRes() {
    return [
        {
            id : 'game_music_start',
            src : '../audio/game_music_start',
            loop : true
        }
        /*
        , 
        {
            id : 'game_music_before_start',
            src : '../audio/game_music_before_start',
            loop : true
        },
        {
            id : 'count_down_music',
            src : '../audio/count_down_music'
        },    
        {
            id : 'lose_mouse_music',
            src : '../audio/lose_mouse_music'
        }, 
        {
            id : 'hit_landmine_music',
            src : '../audio/hit_landmine_music'
        },
        {
            id : 'hit_mouse_music',
            src : '../audio/hit_mouse_music'
        },
        {
            id : 'create_mouse_music',
            src : '../audio/create_mouse_music'
        }
        */
    ];
}

/**
 * 加载音频资源
 */
function initAudioResources() {
    var res = getAudioRes(), len = res.length;
    var item, a;
    for(var i = 0; i < len; i++) {
        item = res[i];
        a = new buzz.sound(item.src, {
            formats : ['mp3',"ogg"],
            preload : true,
            autoload : true,
            loop : !!item.loop
        });
        WpAudio.list[item.id] = a;   
    }
}

/*
function initAudioResources() {  
    var res = getAudioRes()
      , len = res.length;
    var item, a;
    for(var i = 0; i < len; i++) {
        item = res[i];
        a = new Audio5js({
            swf_path: '../swf/audio5js.swf',
            throw_errors: true,
            format_time: true,
            ready: function (player) { 
                this.load(item.src+'.ogg');
            }
        });
        WpAudio.list[item.id] = a; 
    }   
}
*/

