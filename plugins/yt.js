const {
  izumi,
  mode,
  isUrl,
  getJson,
  PREFIX,
  AddMp3Meta,
  getBuffer,
  toAudio,
  yta,
  ytv,
  ytsdl,
  parsedUrl,
} = require("../lib");
const config = require("../config");
const fetch = require("node-fetch"); 
  izumi(
    {
    pattern: "yta ?(.*)",
    fromMe: mode,
    desc: "Download audio from YouTube",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");
    if (!isUrl(match)) return await message.reply("Give me a valid YouTube link");

    try {
      let response = await fetch(`https://api.eypz.c0m.in/ytdl?url=${encodeURIComponent(match)}`);
      let media = await response.json();

      if (!media.status) throw new Error("Download failed");

      let { title, mp4, description, duration } = media.result;
      await message.reply(`> Downloading: ${title}\n\nDescription: _${description}_\n> Duration: ${duration}`);

      let videoBuffer = await getBuffer(mp4);

      let audioBuffer = await toAudio(videoBuffer, 'mp4');

      return await message.sendMessage(
        message.jid,
        audioBuffer,
        {
          mimetype: "audio/mpeg",
          filename: `${title}.mp3`,
          quoted: message.data
        },
        "audio"
      );
    } catch (error) {
      console.error("Error downloading audio:", error);
      return await message.reply(`Failed to download audio: ${error.message}`);
    }
  }
);
izumi(
  {
    pattern: "ytv ?(.*)",
    fromMe: mode,
    desc: "Download video from YouTube",
    type: "downloader",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");
    if (!isUrl(match)) return await message.reply("Give me a valid YouTube link");

    try {
      // Make a request to the new API
      let response = await fetch(`https://api.eypz.c0m.in/ytdl?url=${encodeURIComponent(match)}`);
      let media = await response.json(); // Parse the JSON directly

      if (!media.status) throw new Error("Download failed");

      let { title, mp4, description, duration } = media.result;
      await message.reply(`> Downloading: ${title}\n\nDescription: _${description}_\n> Duration: ${duration}`);

      // Send the video using the mp4 URL
      return await message.sendMessage(
        message.jid,
        mp4,
        {
          mimetype: "video/mp4",
          filename: `${title}.mp4`,
          quoted: message.data
        },
        "video"
      );
    } catch (error) {
      console.error("Error downloading video:", error);
      return await message.reply(`Failed to download video: ${error.message}`);
    }
  }
);
izumi({
    pattern: 'video ?(.*)',
    fromMe: mode,
    desc: 'Search YouTube and return the MP4 URL.',
    type: 'downloader'
}, async (message, match, client) => {
    const query = match || '';
    const searchUrl = `https://api.eypz.c0m.in/youtube?search=${encodeURIComponent(query)}`;
    
    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (searchData.length > 0) {
            const firstResult = searchData[0];
            const firstResultLink = firstResult.link;
            const ytdlUrl = `https://api.eypz.c0m.in/ytdl?url=${encodeURIComponent(firstResultLink)}`;
            
            const ytdlResponse = await fetch(ytdlUrl);
            const ytdlData = await ytdlResponse.json();
            
            if (ytdlData?.result?.mp4) {
                const title = ytdlData.result.title || 'the file';
                await message.reply(`Downloading ${title}...`);
                await message.sendFile(ytdlData.result.mp4);
            } else {
                await message.reply('No MP4 URL found.');
            }
        } else {
            await message.reply('No search results found.');
        }
    } catch (error) {
        await message.reply('An error occurred while processing your request.');
    }
});
izumi({
    pattern: 'song ?(.*)',
    fromMe: mode,
    desc: 'Search YouTube and return the MP4 URL.',
    type: 'downloader'
}, async (message, match, client) => {
    const query = match || '';
    const searchUrl = `https://api.eypz.c0m.in/youtube?search=${encodeURIComponent(query)}`;
    
    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (searchData.length > 0) {
            const firstResult = searchData[0];
            const firstResultLink = firstResult.link;
            const ytdlUrl = `https://api.eypz.c0m.in/ytdl?url=${encodeURIComponent(firstResultLink)}`;
            
            const ytdlResponse = await fetch(ytdlUrl);
            const ytdlData = await ytdlResponse.json();
            
            if (ytdlData?.result?.mp4) {
                const title = ytdlData.result.title || 'the file';
                await message.reply(`Downloading ${title}...`);
let videoBuffer = await getBuffer(ytdlData.result.mp4);

      let audioBuffer = await toAudio(videoBuffer, 'ytdlData.result.mp4');

      return await message.sendMessage(
        message.jid,
        audioBuffer,
        {
          mimetype: "audio/mpeg",
          filename: `${title}.mp3`,
          quoted: message.data
        },
        "audio"
      );
            } else {
                await message.reply('No MP4 URL found.');
            }
        } else {
            await message.reply('No search results found.');
        }
    } catch (error) {
        await message.reply('An error occurred while processing your request.');
    }
});
izumi(
  {
    pattern: "yts ?(.*)",
    fromMe: mode,
    desc: "Search YouTube videos",
    type: "downloader",
  },
  async (message, match, m) => {
    try {
      match = match || message.reply_message.text;

      if (!match) {
        await message.reply("Please provide a search query to find YouTube videos.\nExample: `.youtube Naruto AMV`");
        return;
      }

      const response = await getJson(eypzApi + `youtube?search=${encodeURIComponent(match)}`);

      if (!response || response.length === 0) {
        await message.reply("Sorry, no YouTube videos found for your search query.");
        return;
      }

      // Format the response into a readable message
      const formattedMessage = formatYouTubeMessage(response);

      // Construct context info message
      const contextInfoMessage = {
        text: formattedMessage,
        contextInfo: {
          mentionedJid: [message.sender],
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363298577467093@newsletter',
            newsletterName: "Iᴢᴜᴍɪ-ᴠ3",
            serverMessageId: -1
          }
        }
      };

      // Send the formatted message with context info
      await message.client.sendMessage(message.jid, contextInfoMessage);

    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      await message.reply("Error fetching YouTube videos. Please try again later.");
    }
  }
);

function formatYouTubeMessage(videos) {
  let message = "*YouTube Search Results:*\n\n";

  videos.forEach((video, index) => {
    message += `${index + 1}. *Title:* ${video.title}\n   *Duration:* ${video.duration}\n   *Link:* ${video.link}\n\n`;
  });

  return message;
        }
