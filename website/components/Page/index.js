import ELements from "./Elements";

export default function Page({ _id, pages, setting }) {


    return <>{_id && <ELements
        _uid={'0'}
        _id={_id}
        pages={pages}
        setting={setting}
    />}
    </>



};