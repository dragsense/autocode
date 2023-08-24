import { Button, Table, Space, Menu } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import Link from "next/link";
import { AiFillFile, AiOutlineEdit, AiOutlineSetting, AiOutlineDelete } from 'react-icons/ai';
import SingleVideo from "./Video";

const VideoList = ({ videos }) => {
    return videos.map(video => <SingleVideo video={video} />)
};

export default VideoList;
