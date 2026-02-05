import { svc, type SubscriptionService } from "./types"

// ── Additional Entertainment Services ────────────────────────────────

export const additionalEntertainmentServices: SubscriptionService[] = [
  svc("BET+", "bet-plus", "entertainment", "Streaming service celebrating Black culture with original series, movies, and specials",
    "https://bet.com/bet-plus", [["Monthly", 9.99, null]], ["Original series", "Black cinema", "Stand-up comedy", "Live events", "Ad-free streaming"], ["streaming", "culture", "originals", "entertainment"], 2019, "New York, New York"),
  svc("Stan", "stan", "entertainment", "Australian streaming service with exclusive originals and blockbuster movies",
    "https://stan.com.au", [["Basic", 12, null], ["Standard", 16, null], ["Premium", 21, null]], ["Australian originals", "Blockbusters", "Sports add-on", "4K streaming", "Offline downloads"], ["streaming", "australian", "originals", "movies"], 2015, "Sydney, Australia"),
  svc("Crave", "crave", "entertainment", "Canadian streaming platform with HBO, Showtime, and Crave originals",
    "https://crave.ca", [["Mobile", 9.99, null], ["Standard", 19.99, null], ["Premium", 22, null]], ["HBO content", "Showtime series", "Crave originals", "French content", "Live channels"], ["streaming", "canadian", "hbo", "originals"], 2014, "Toronto, Canada"),
  svc("Hotstar", "hotstar", "entertainment", "Disney+ Hotstar streaming with Bollywood, sports, and international content",
    "https://hotstar.com", [["Mobile", 2.99, null], ["Super", 7.99, null], ["Premium", 12.99, null]], ["Bollywood movies", "Cricket streaming", "Disney+ content", "Regional content", "Sports"], ["streaming", "bollywood", "sports", "indian"], 2015, "Mumbai, India"),
  svc("SonyLIV", "sonyliv", "entertainment", "Sony's streaming platform with exclusive originals, sports, and international shows",
    "https://sonyliv.com", [["Mobile", 3.99, null], ["Premium", 6.99, null]], ["Sony originals", "Sports streaming", "International shows", "Hindi content", "WWE"], ["streaming", "sony", "sports", "originals"], 2013, "Mumbai, India"),
  svc("Zee5", "zee5", "entertainment", "Indian streaming platform with originals, movies, and TV shows in 12 languages",
    "https://zee5.com", [["Free", 0, null], ["Premium", 4.99, null]], ["12 languages", "Originals", "Live TV", "Movies", "Kids content"], ["streaming", "indian", "multilingual", "originals"], 2018, "Mumbai, India"),
  svc("Showmax", "showmax", "entertainment", "African streaming service with originals, sports, and international content",
    "https://showmax.com", [["Mobile", 2.99, null], ["Standard", 7.99, null], ["Pro", 12.99, null]], ["African originals", "Sports", "International shows", "Offline viewing", "Multiple profiles"], ["streaming", "african", "sports", "originals"], 2015, "Amsterdam, Netherlands"),
  svc("ITVX", "itvx", "entertainment", "British streaming service with thousands of hours of free and premium content",
    "https://itvx.com", [["Free", 0, null], ["Premium", 5.99, null]], ["British TV", "ITV shows", "Classic series", "Live TV", "BritBox content"], ["streaming", "british", "free", "itv"], 2022, "London, UK"),
  svc("Roku Channel", "roku-channel", "entertainment", "Free ad-supported streaming with movies, TV shows, and live channels",
    "https://therokuchannel.roku.com", [["Free", 0, null]], ["Free streaming", "Live TV channels", "Movies", "TV shows", "Roku originals"], ["streaming", "free", "live-tv", "ad-supported"], 2017, "San Jose, California"),
  svc("Tencent Video", "tencent-video", "entertainment", "Chinese streaming platform with drama, anime, and variety shows",
    "https://v.qq.com", [["Free", 0, null], ["VIP", 3.99, null], ["SVIP", 7.99, null]], ["Chinese dramas", "Anime", "Variety shows", "Sports", "4K content"], ["streaming", "chinese", "drama", "anime"], 2011, "Shenzhen, China"),
  svc("Plex Free", "plex-free", "entertainment", "Free streaming with movies, TV shows, and live channels plus personal media",
    "https://plex.tv", [["Free", 0, null], ["Plex Pass", 4.99, 39.99]], ["Free streaming", "Personal media server", "Live TV", "DVR", "Music library"], ["streaming", "media-server", "free", "personal"], 2009, "Los Gatos, California"),
  svc("Xumo", "xumo", "entertainment", "Free streaming service with live TV channels and on-demand content",
    "https://xumo.com", [["Free", 0, null]], ["Free streaming", "Live channels", "On-demand", "News", "Sports highlights"], ["streaming", "free", "live-tv", "ad-supported"], 2011, "Irvine, California"),
]

// ── Additional Music Services ────────────────────────────────────────

export const additionalMusicServices: SubscriptionService[] = [
  svc("Gaana", "gaana", "music", "Indian music streaming with Bollywood, regional, and international music",
    "https://gaana.com", [["Free", 0, null], ["Plus", 3.99, null]], ["Bollywood music", "Regional songs", "Podcasts", "HD quality", "Offline downloads"], ["indian-music", "bollywood", "streaming", "regional"], 2010, "Noida, India"),
  svc("JioSaavn", "jiosaavn", "music", "Indian and global music streaming with original podcasts and shows",
    "https://jiosaavn.com", [["Free", 0, null], ["Pro", 1.99, null]], ["Indian music", "International library", "Original podcasts", "Lyrics", "Offline mode"], ["indian-music", "streaming", "podcasts", "bollywood"], 2007, "Mumbai, India"),
  svc("Anghami", "anghami", "music", "Arabic and international music streaming with millions of songs",
    "https://anghami.com", [["Free", 0, null], ["Plus", 4.99, null]], ["Arabic music", "International library", "Offline mode", "Lyrics", "Podcasts"], ["arabic-music", "streaming", "international", "podcasts"], 2012, "Abu Dhabi, UAE"),
  svc("Nugs.net", "nugs-net", "music", "Live music streaming for concert recordings from top artists",
    "https://nugs.net", [["Free", 0, null], ["HiFi", 12.99, 129.99]], ["Live concerts", "Concert recordings", "Hi-Fi audio", "Exclusive shows", "Download access"], ["live-music", "concerts", "hi-fi", "recordings"], 2002, "Los Angeles, California"),
  svc("Primephonic", "primephonic", "music", "Classical music streaming with lossless audio and intelligent search",
    "https://primephonic.com", [["Essential", 7.99, null], ["Premium", 14.99, null]], ["Classical streaming", "Lossless quality", "Intelligent search", "Curated playlists", "Offline mode"], ["classical", "hi-res", "streaming", "curation"], 2014, "Amsterdam, Netherlands"),
  svc("Bandcamp", "bandcamp", "music", "Independent music platform supporting artists with direct purchases and subscriptions",
    "https://bandcamp.com", [["Fan", 0, null], ["Artist Pro", 10, null]], ["Indie music", "Direct artist support", "High-quality downloads", "Vinyl records", "Fan collections"], ["indie", "artist-support", "downloads", "vinyl"], 2007, "Oakland, California"),
  svc("SiriusXM", "siriusxm", "music", "Satellite and streaming radio with music, talk, sports, and Howard Stern",
    "https://siriusxm.com", [["Music & Entertainment", 10.99, null], ["Platinum", 13.99, null], ["All Access", 21.99, null]], ["Satellite radio", "Live sports", "Talk shows", "Commercial-free music", "Howard Stern"], ["satellite-radio", "talk-shows", "sports", "live"], 2001, "New York, New York"),
  svc("Mixcloud Pro", "mixcloud-pro", "music", "Professional DJ mix hosting and streaming platform for creators",
    "https://mixcloud.com", [["Free", 0, null], ["Select", 4.99, null], ["Pro", 13.99, null]], ["DJ mixes", "Radio shows", "Podcasts", "Creator tools", "Offline listening"], ["dj", "mixes", "radio", "creator"], 2008, "London, UK"),
  svc("Distrokid", "distrokid", "music", "Music distribution service for artists to release music on all major platforms",
    "https://distrokid.com", [["Musician", 22.99, null], ["Musician Plus", 35.99, null], ["Label", 79.99, null]], ["Music distribution", "Streaming royalties", "All platforms", "Unlimited uploads", "Split payments"], ["distribution", "artist-tools", "royalties", "publishing"], 2013, "New York, New York"),
  svc("Spotify for Artists", "spotify-for-artists", "music", "Tools and analytics platform for music creators on Spotify",
    "https://artists.spotify.com", [["Free", 0, null]], ["Streaming analytics", "Playlist pitching", "Fan insights", "Profile customization", "Canvas video"], ["artist-analytics", "spotify", "streaming", "creator-tools"], 2015, "Stockholm, Sweden"),
]
