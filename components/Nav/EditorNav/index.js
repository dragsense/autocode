
import { Button, Tooltip } from "antd";
import { MdUndo, MdRedo } from "react-icons/md";
import BreakPoints from "@/components/BreakPoint";
import Link from 'next/link';


const EditorNav = ({
    undo,
    redo,
    windowWidth,
    setWindowWidth,
    minMax,
    setMinMax,
    onSubmit,
    state,
    orientation,
    setOrientation, }) => {


    return (<>

        <div style={{
            display: 'flex',
            justifyContent: ' space-between',
            alignItems: 'center',
            width: '100%',
        }}>



            <Link href="/admin/dashboard"><Button type="primary">Go to dashboard</Button></Link>


            <BreakPoints windowWidth={windowWidth} setWindowWidth={setWindowWidth}
                minMax={minMax}
                setMinMax={setMinMax}
                orientation={orientation}
                setOrientation={setOrientation} />

            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <Tooltip placement="bottom" title="Undo">
                    <Button 
                        icon={<MdUndo size={20} />}
                        onClick={(e) => { e.preventDefault(); undo(); }}
                    >  </Button>
                </Tooltip>

                <Tooltip placement="bottom" title="Redo">
                    <Button 
                        icon={<MdRedo size={20} />}
                        onClick={(e) => { e.preventDefault(); redo(); }}
                    >  </Button>
                </Tooltip>

            </div>


            <Button type="primary"
                disabled={!state?.isChange}
                loading={state?.loading}
                onClick={(e) => { e.preventDefault(); onSubmit() }}>Save</Button>
        </div>

    </>
    );

};

export const EditorStyleNav = ({
    undo,
    redo,
    windowWidth,
    setWindowWidth,
    minMax,
    setMinMax,
    orientation,
    setOrientation, }) => {


    return (<>

        <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
        }}>


            <BreakPoints windowWidth={windowWidth} setWindowWidth={setWindowWidth}
                minMax={minMax}
                setMinMax={setMinMax}
                orientation={orientation}
                setOrientation={setOrientation} />

            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <Tooltip placement="bottom" title="Undo">
                    <Button 
                        icon={<MdUndo size={20} />}
                        onClick={(e) => { e.preventDefault(); undo(); }}
                    >  </Button>
                </Tooltip>

                <Tooltip placement="bottom" title="Redo">
                    <Button 
                        icon={<MdRedo size={20} />}
                        onClick={(e) => { e.preventDefault(); redo(); }}
                    >  </Button>
                </Tooltip>

            </div>
        </div>

    </>
    );

};


export default EditorNav;
