// ==UserScript==
// @name         Twitch.TV Chat Playback
// @namespace    http://logsofshame.com/
// @version      1.0.0
// @description  Plays back chat alongside Twitch VoDs.  Requires channel owner
//               approval to work on VoDs older than 2 days or on VoDs of
//               private broadcasts.  Go to http://logsofshame.com/ for details.
// @match        http://*.twitch.tv/*
// @grant        unsafeWindow
// ==/UserScript==

var playback = function($, Twitch, Chat, ich) {
  console.log(Twitch.player.getPlayer().get_time);
  console.log('loaded!');
  // A copy of what the server renders on a channel's live page.
  var initial_chat_dom = "<script id='chat-emoticon' type='text/html'>\n<span class='emo-{{id}} emoticon'></span>\n</script>\n<script id='chat-mod-buttons' type='text/html'><a class='mod_button timeout' title='Timeout {{sender}}'><img alt=\"Timeout\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_clock-00000080.png\" /></a><a class='mod_button ban' title='Ban {{sender}}'><img alt=\"Ban\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_ban-00000080.png\" /></a><a class='mod_button unban' style='display:none;' title='Unban {{sender}}'><img alt=\"Unban\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unban-00000080.png\" /></a></script>\n<script id='chat-line-action' type='text/html'>\n<li class='chat_from_{{sender}} line' data-sender='{{sender}}'>\n<p style='color:{{color}}'><span class='small'>{{timestamp}}&nbsp;</span>{{#showModButtons}}{{> chat-mod-buttons}}{{/showModButtons}}<span class='nick'>{{displayname}}</span>&nbsp;<span class='chat_line' style='{{color}}'>@message</span></p>\n</li>\n</script>\n<script id='chat-line' type='text/html'>\n<li class='chat_from_{{sender}} line' data-sender='{{sender}}'>\n<p><span class='small'>{{timestamp}}&nbsp;</span>@tag{{#showModButtons}}{{> chat-mod-buttons}}{{/showModButtons}}<a class='nick' href='/{{sender}}' id='{{id}}' style='color:{{color}}'>{{displayname}}</a>:&nbsp;<span class='chat_line'>@message</span></p>\n</li>\n</script>\n<script id='user-info' type='text/html'>\n<div id='user_info' style='display:none'>\n<a href=\"#\" id=\"close_user_info\" onclick=\"CurrentChat.close_chat_popup(); return false;\"><img src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_close-FFFFFF80.png\" /></a>\n<h3 class='nick' id='chat_menu_login'>Username</h3>\n<div class='clearfix' id='user_chat_actions'>\n<a href=\"\" class=\"chat_user_pic_container\"><img alt=\"\" id=\"chat_user_pic\" src=\"http://www-cdn.jtvnw.net/images/spinner.gif\" /></a>\n<span id='chat_menu_tools'>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_ignore\" tooltipdata=\"Ignore\"><span class=\"glyph_only\"><img alt=\"Ignore\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_ignore-00000080.png\" /></span></a>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_unignore\" tooltipdata=\"Unignore\"><span class=\"glyph_only\"><img alt=\"Unignore\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unignore-00000080.png\" /></span></a>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_follow\" tooltipdata=\"Follow\"><span class=\"glyph_only\"><img alt=\"Follow\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_follow-00000080.png\" /></span></a>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_unfollow\" tooltipdata=\"Unfollow\"><span class=\"glyph_only\"><img alt=\"Unfollow\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unfollow-00000080.png\" /></span></a>\n<span id='chat_menu_pm' style='display:none;'></span>\n</span>\n<span id='chat_menu_op_tools'>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_timeout\" tooltipdata=\"Timeout\"><span class=\"glyph_only\"><img alt=\"Timeout\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_timeout-00000080.png\" /></span></a>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_ban\" tooltipdata=\"Ban\"><span class=\"glyph_only\"><img alt=\"Ban\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_ban-00000080.png\" /></span></a>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_unban\" tooltipdata=\"Unban\"><span class=\"glyph_only\"><img alt=\"Unban\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unban-00000080.png\" /></span></a>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_voice\" tooltipdata=\"Voice\"><span class=\"glyph_only\"><img alt=\"Voice\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_voice-00000080.png\" /></span></a>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_unvoice\" tooltipdata=\"Unvoice\"><span class=\"glyph_only\"><img alt=\"Unvoice\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unvoice-00000080.png\" /></span></a>\n</span>\n<span id='chat_menu_owner_tools'>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_op\" tooltipdata=\"Op\"><span class=\"glyph_only\"><img alt=\"Op\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_op-00000080.png\" /></span></a>\n<a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_deop\" tooltipdata=\"Deop\"><span class=\"glyph_only\"><img alt=\"Deop\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_deop-00000080.png\" /></span></a>\n</span>\n<span id='user_link_actions'>\n<a href=\"#\" class=\"chat_menu_action js-new-tab g18_eye-FFFFFF80\" id=\"chat_user_channel_link\">Channel</a>\n<a href=\"#\" class=\"chat_menu_action js-new-tab g18_person-FFFFFF80\" id=\"chat_user_videos_link\">Profile</a>\n<a href=\"#\" class=\"chat_menu_action js-new-tab g18_mail-FFFFFF80\" id=\"chat_user_message_link\">Message</a>\n</span>\n</div>\n</div>\n</script><div class=\"content\">\n  <div class=\"top\">\n    <ul class=\"segmented_tabs\" id=\"right_nav\">\n      <li>\n        <a class=\"selected tab\" target=\"chat\">Chat</a>\n      </li>\n      <li>\n        <a class=\"tab\" target=\"archives\">Videos</a>\n      </li>\n    </ul>\n  </div>\n  <div class=\"stretch\" id=\"chat\">\n    <!-- Username onclick banner -->\n    <div id=\"user_info\" style=\"display:none\">\n      <a href=\"#\" id=\"close_user_info\" onclick=\"CurrentChat.close_chat_popup(); return false;\"><img src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_close-FFFFFF80.png\"></a>\n      <h3 class=\"nick\" id=\"chat_menu_login\">Username</h3>\n      <div class=\"clearfix\" id=\"user_chat_actions\">\n        <a href=\"\" class=\"chat_user_pic_container\"><img alt=\"\" id=\"chat_user_pic\" src=\"http://www-cdn.jtvnw.net/images/spinner.gif\"></a>\n        <span id=\"chat_menu_tools\">\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_ignore\" tooltipdata=\"Ignore\"><span class=\"glyph_only\"><img alt=\"Ignore\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_ignore-00000080.png\"></span></a>\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_unignore\" tooltipdata=\"Unignore\"><span class=\"glyph_only\"><img alt=\"Unignore\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unignore-00000080.png\"></span></a>\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_follow\" tooltipdata=\"Follow\"><span class=\"glyph_only\"><img alt=\"Follow\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_follow-00000080.png\"></span></a>\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_unfollow\" tooltipdata=\"Unfollow\"><span class=\"glyph_only\"><img alt=\"Unfollow\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unfollow-00000080.png\"></span></a>\n          <span id=\"chat_menu_pm\" style=\"display:none;\"></span>\n        </span>\n        <span id=\"chat_menu_op_tools\">\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_timeout\" tooltipdata=\"Timeout\"><span class=\"glyph_only\"><img alt=\"Timeout\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_timeout-00000080.png\"></span></a>\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_ban\" tooltipdata=\"Ban\"><span class=\"glyph_only\"><img alt=\"Ban\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_ban-00000080.png\"></span></a>\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_unban\" tooltipdata=\"Unban\"><span class=\"glyph_only\"><img alt=\"Unban\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unban-00000080.png\"></span></a>\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_voice\" tooltipdata=\"Voice\"><span class=\"glyph_only\"><img alt=\"Voice\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_voice-00000080.png\"></span></a>\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_unvoice\" tooltipdata=\"Unvoice\"><span class=\"glyph_only\"><img alt=\"Unvoice\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_unvoice-00000080.png\"></span></a>\n        </span>\n        <span id=\"chat_menu_owner_tools\">\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_op\" tooltipdata=\"Op\"><span class=\"glyph_only\"><img alt=\"Op\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_op-00000080.png\"></span></a>\n          <a href=\"#\" class=\"normal_button tooltip chat_menu_btn\" id=\"chat_menu_deop\" tooltipdata=\"Deop\"><span class=\"glyph_only\"><img alt=\"Deop\" src=\"http://www-cdn.jtvnw.net/images/xarth/g/g18_deop-00000080.png\"></span></a>\n        </span>\n        <span id=\"user_link_actions\">\n          <a href=\"#\" class=\"chat_menu_action js-new-tab g18_eye-FFFFFF80\" id=\"chat_user_channel_link\">Channel</a>\n          <a href=\"#\" class=\"chat_menu_action js-new-tab g18_person-FFFFFF80\" id=\"chat_user_videos_link\">Profile</a>\n          <a href=\"#\" class=\"chat_menu_action js-new-tab g18_mail-FFFFFF80\" id=\"chat_user_message_link\">Message</a>\n        </span>\n      </div>\n    </div>\n\n\n    <div id=\"chat_loading_spinner\"></div>\n\n    <div id=\"facebook_cancelled\" style=\"display:none;\">\n      <a class=\"pretty_button\" href=\"#\" onclick=\"jQuery('#facebook_cancelled').hide(); return false;; return false;\">Return to Chat</a>\n    </div>\n    <img id=\"facebook_logging_in\" src=\"http://www-cdn.jtvnw.net/images/spinner.gif\" style=\"display:none;\">\n\n    <div id=\"chat_redisplay_holder\" style=\"display:none\">\n      <p>\n        Chat is hidden.\n      </p>\n      <a class=\"primary_button\" href=\"#\" id=\"chat_toggle\" onclick=\"toggle_chat(); return false;\"><span>Show Chat</span></a>\n    </div>\n\n    <div id=\"chat_tooltip_anchor\"></div>\n\n    <div id=\"twitch_chat\" class=\"chat_box\">\n      <div class=\"js-chat-scroll scroll stretch\">\n        <div class=\"tse-scroll-content\">\n          <div class=\"tse-content nobuttons\">\n            <ul id=\"chat_line_list\"></ul>\n          </div>\n        </div>\n      </div>\n\n      <div id=\"speak\" class=\"bottom\">\n        <div id=\"speak_cover\" style=\"display:none\"></div>\n        <div id=\"controls\">\n          <div id=\"control_input\">\n            <textarea autocomplete=\"off\" class=\"text\" id=\"chat_text_login\" name=\"chat_text_login\" placeholder=\"\" disabled=\"\" style=\"\" tabindex=\"1\">Chat is in playback mode</textarea>\n          </div>\n          <div id=\"control_buttons\">\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"stretch js-columns-scroll scroll\" id=\"archives\">\n    <div class=\"tse-scroll-content\">\n      <div class=\"tse-content\">\n        <div class=\"js-archive_list\"></div>\n      </div>\n    </div>\n    <a class=\"more_archives bottom\" href=\"/not_tim/videos\">More Videos\n    </a>\n  </div>\n</div>";

  // losapi host
  var losapi = "logsofshame.com/api"
  // xmlapi host
  var xmlapi = "logsofshame.com/xml"

  // Are we on a VoD page?
  var url_info = /twitch\.tv\/(?:([^\/]+)\/)?([bmc])\/(\d+)/.exec(location.href);

  var video_id = [{b: 'a', c: 'c', m: '_'}[url_info[2]], url_info[3]].join('');
  var is_clip = url_info[2] === 'c' || url_info[2] === 'm';
  // Handle bookmarks
  if (url_info[1] === undefined && url_info[2] === 'm') {
    var m = $('#archive_site_player_flash > param[name=flashvars]')
      .attr('value')
      .match(/archive_id=(\d+)/);
    if (m !== null) {
      video_id = 'a' + m[1];
    } else {
      return;
    }
  }

  var player = Twitch.player.getPlayer();
  if (typeof player.get_time !== 'function') {
    console.log("Broadcast player detected");
    return;
  }

  var get_messages = function(channel, start, end, skip, callback) {
    // see: https://github.com/Mischanix/losapi
    $.getJSON(['http://', losapi, '/messages?limit=500&',
      'channel=', channel, '&start=', start.toString(10),
      '&end=', end.toString(10), '&offset=', skip.toString(10)
    ].join(''), callback);
  };
  var messages = {};
  var add_message = function(m) {
    var bucket = Math.floor(m.received / (1000 * 5));
    if (!Array.isArray(messages[bucket])) {
      messages[bucket] = [m];
    } else {
      messages[bucket].unshift(m);
    }
  };
  var messages_near_time = function(t) {
    // get messages in buckets from t-60s to t+5s
    var start = Math.floor(t / (1000 * 5));
    var result = messages[start + 1] || [];
    result = (messages[start] || []).concat(result);
    var i = -1;
    var limit = -500;
    while (result.length < 150 && i > -500) {
      result = (messages[start + i] || []).concat(result);
      i--;
    }
    return result;
  };

  var get_user_commands = function(channel, start, skip, callback) {
    $.getJSON(['http://', losapi, '/messages?is_command=true&limit=500',
      '&channel=', channel, '&start=', start.toString(10),
      '&offset=', skip.toString(10)
    ].join(''), callback);
  };

  Twitch.api.get('videos/' + video_id).done(function(e) {
    var recorded_at = new Date(e.recorded_at).getTime();
    var channel = e.channel.name;

    // == Begin chat coolness
    // Save archive videos
    var archives = $('.js-archive_list')[0];
    // Replace the right column with chat
    $('#right_col').html(initial_chat_dom);
    // Reload templates (we need some for chat)
    ich.grabTemplates();
    // Setup #chat_lines TrackpadScrollEmulator
    $("#twitch_chat .tse-scroll-content")
      .attr("id", "chat_lines")
      .attr("onscroll", "CurrentChat.set_currently_scrolling()");
    // Rerun .stretch styles
    $(".stretch").each(function() {
      var self = $(this);
        var t = 0 + self.siblings(".top:first").outerHeight()
          , n = 0 + self.siblings(".bottom:first").outerHeight();
        self.css({top: t + "px",bottom: n + "px",visibility: "visible"});
    });
    // Rebuild Videos tab
    $('.tab').tabify();
    $('.js-archive_list').html($(archives).html());
    unsafeWindow.CurrentChat = new Chat(channel);
    var chat = unsafeWindow.CurrentChat;
    chat.setupHandlers.bind(chat)();
    var handlers = chat.handlers;

    var process_command = function(c) {
      if(c.command === 'USERCOLOR') {
        chat.user_to_color[c.user] = c.arg;
      } else if (c.command === 'EMOTESET') {
        var emoteset = c.arg.substring(1, c.arg.length - 1).split(',');
        for (var i = 0; i < emoteset.length; i++) {
          emoteset[i] = parseInt(emoteset[i], 10);
        }
        chat.user_to_emote_sets[c.user] = emoteset;
      } else if (c.command === 'SPECIALUSER') {
        if (c.arg === 'moderator') {
          chat.moderators[c.user] = true;
        } else if (c.arg === 'staff') {
          chat.staff[c.user] = true;
        } else if (c.arg === 'admin') {
          chat.admins[c.user] = true;
        } else if (c.arg === 'subscriber') {
          chat.subscribers[c.user] = true;
        } else if (c.arg === 'turbo') {
          chat.turbos[c.user] = true;
        }
      }
    };

    var start_time = recorded_at - 30000;

    (function() {
      var n = 0;
      var skip = 0;
      var commands_cb = function(o) {
        for (var i = 0; i < o.messages.length; i++) {
          process_command(o.messages[i]);
          n++;
        }
        console.log(o.count, o.messages.length, n);
        if (n < o.count) {
          skip += 500;
          get_user_commands(channel, start_time, skip, commands_cb);
        } else {
          // post commands load...
        }
      };
      get_user_commands(channel, start_time, skip, commands_cb);
    })();

    (function() {
      var end_time = recorded_at + e.length * 1000 + 30000;
      console.log(start_time, end_time);
      var n = 0;
      var skip = 0;
      var messages_cb = function(o) {
        for (var i = 0; i < o.messages.length; i++) {
          add_message(o.messages[i]);
          n++;
        }
        console.log(o.count, o.messages.length, n);
        if (n < o.count) {
          skip += 500;
          get_messages(channel, start_time, end_time, skip, messages_cb);
        } else {
          // post messages load...
        }
      };
      get_messages(channel, start_time, end_time, skip, messages_cb);
    })();

    var show_message = function(m, offset) {
      m.shown = true;
      var show = function() {
        if (typeof m.command !== 'undefined') {
          if (m.command == 'CLEARCHAT') {
            handlers.clear_chat.bind(chat)({
              target: 'user',
              user: m.user
            });
          }
        } else {
          handlers.channel_message.bind(chat)({
            sender: m.user,
            recipient: channel,
            message: m.message.replace(/^\x01ACTION\ /, '').replace(/\x01$/, ''),
            timestamp: m.received,
            is_action: m.message.match(/^\x01ACTION/) !== null,
            history: false
          });
        }
      };
      if (offset && offset > 0) {
        setTimeout(show, offset);
      } else {
        show();
      }
    };

    var reset_chat = function() {
      console.log('resetting the chat');
      chat.clear_chat_lines();
      for (var bucket in messages) {
        for (var i = 0; i < messages[bucket].length; i++) {
          messages[bucket][i].shown = false;
        }
      }
      update(true);
    };

    var is_paused = (function() {
      var last_time = 0;
      var last_date = Date.now();
      var last_result = false;
      return function() {
        var curr_date = Date.now();
        var result = false;
        // XXX hacky, relies on is_paused being called at 1s intervals
        if (curr_date - last_date < 750) {
          return last_result;
        }

        var curr_time = player.get_time() * 1000;
        if (curr_date - last_date > curr_time - last_time + 500) {
          result = true;
        }
        last_time = curr_time;
        last_date = curr_date;
        last_result = result;
        return result;
      };
    })();

    var begin = new Date();
    var last = 0;
    var clip_start = 0;
    var last_update = Date.now();
    var update = function(forced) {
      var curr = player.get_time() * 1000;
      var diff = curr - last;
      if (!is_paused()) {
        last = player.get_time() * 1000;
      }
      // Timeouts are doubled for background tabs in Chrome.
      var interval_time = Date.now() - last_update;
      last_update = Date.now();
      if (!forced && !is_paused() && Math.abs(interval_time - diff) > 500) {
        reset_chat();
      } else {
        setTimeout(update, 1000);
        var the_time = recorded_at + curr - clip_start +
          // 2000 to simulate a bit of stream delay, 750 * [30m] to account for
          // vod cutting being weird.
          2000 + 750 * curr / (30 * 60 * 1000);
        var ms = messages_near_time(the_time);
        for (var i = 0; i < ms.length; i++) {
          var offset = ms[i].received - the_time;
          if (!ms[i].shown && offset < 1000) {
            show_message(ms[i], offset);
          }
        }
      }
    };
    var begin_playback = function() {
      last = player.get_time() * 1000;
      handlers.history_end.bind(chat)({});
      reset_chat();
    };
    if (is_clip) {
      var m = $('#archive_site_player_flash > param[name=flashvars]')
        .attr('value')
        .match(/initial_time=(\d+)/);
      if (m !== null) {
        clip_start = parseInt(m[1], 10) * 1000
        begin_playback();
      } else {
        $.getJSON(
          ['http://', xmlapi, '/broadcast/by_chapter/',
            url_info[3].toString(10)].join(''),
          function(o) {
            clip_start = parseInt(o['archives.bracket_start'][0], 10) * 1000;
            begin_playback();
          }
        );
      }
    } else {
      begin_playback();
    }
  });
};

(function() {
  if (unsafeWindow.top != unsafeWindow) {
    return;
  }

  var url_info = /twitch\.tv\/(?:([^\/]+)\/)?([bmc])\/(\d+)/.exec(location.href);
  if (url_info === null) {
    return;
  }

  var main = function() {
    playback(unsafeWindow.jQuery, unsafeWindow.Twitch, unsafeWindow.Chat, unsafeWindow.ich);
  };
  var interval = setInterval(function() {
    try {
      unsafeWindow.Twitch.player.getPlayer().get_time();
      clearInterval(interval);
      main();
    } catch(e) {
      // errors: getPlayer is undefined
      //         getPlayer() returns nothing
      //         embed hasn't called ExternalInterface.addCallback yet for get_time
      //         calling get_time dereferences a yet-to-exist AS3 object
      //         calling get_time returns a value
      //         ... for paused
    }
  }, 100);
  setTimeout(function() {
    clearInterval(interval);
  }, 30000);
})();
