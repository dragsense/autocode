import { useState } from "react";
import MediaComponent from "..";
import VideoList from './VideoList';

export function VideoComponent({ user, videos }) {

    const [_videos, _setVideos] = useState(videos);

    const onAddMore = (newVideos) => {

        _setVideos([..._videos, newVideos])
    }


    return <MediaComponent user={user} onAdd={onAddMore}>

        <div className="inner-box border" style={{ flex: 1 }}><VideoList videos={_videos} /></div>
        <div style={{ width: 20 }}></div>
        <div className="inner-box border" style={{ width: 250 }}>detaile</div>


    </MediaComponent>
};

