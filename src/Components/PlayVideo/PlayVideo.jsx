import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'
import { useParams } from 'react-router-dom'


const PlayVideo = () => {

    const {videoId} = useParams();

    const [commentData, setCommentData] = useState([]);


    const [apiData, setApiData] = useState(null);

    const fetchVideoData = async () => {
        //Fething videos data
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
        await fetch(videoDetails_url).then(res => res.json()).then(data => setApiData(data.items[0]));

        //fetching Comment data

        const Comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
        await fetch(Comment_url).then(res => res.json()).then(data => setCommentData(data.items));
    }

    useEffect(() => {
        fetchVideoData();
    }, [videoId])



    const [channelData, setchannelData] = useState(null);

    const fetchOtherData = async () => {
        //fetching Chanel Data
        const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelDetails_url).then(res => res.json()).then(data => setchannelData(data.items[0]));
    }

    useEffect(() => {
        fetchOtherData();
    }, [apiData])






    return (
        <div className='play-video'>

            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
            <div className='play-video-info'>
                <p>{apiData ? value_converter(apiData.statistics.viewCount) : "0"} views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""} </p>
                <div>
                    <span><img src={like} alt="" /> {apiData ? value_converter(apiData.statistics.likeCount) : ""}</span>
                    <span><img src={dislike} alt="" /></span>
                    <span><img src={share} alt="" /> Share</span>
                    <span><img src={save} alt="" /> Save</span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="" />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "0"} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>

            <div className="vid-description">
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description"}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : "0"} Comments</h4>


                <div className="comment-section">

                    {commentData.map((item, index) => {
                        return (
                            <div key={index} className="comment">
                                <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                                <div>
                                    <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{ }</span> </h3>
                                    <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                    <div className="comment-action">
                                        <img src={like} alt="" />
                                        <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                        <img src={dislike} alt="" />

                                    </div>
                                </div>
                            </div>
                        )
                    })}



                </div>

            </div>
        </div>

    )
}

export default PlayVideo
