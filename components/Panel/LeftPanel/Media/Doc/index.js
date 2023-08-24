import MediaComponent from "..";
import DocList from "./DocList";

export function DocComponent({ user, docs }) {
    return <MediaComponent user={user}>
    <div className="inner-box border" style={{flex: 1}}><DocList docs={docs} /></div>
        <div style={{width: 20}}></div>
        <div className="inner-box border" style={{width: 250}}>detaile</div>
    
    </MediaComponent>
 
};

