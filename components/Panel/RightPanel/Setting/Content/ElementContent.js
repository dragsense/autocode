// import { Form, Input, Button, Popconfirm, Divider, Cascader, Image, Select } from "antd";
// import dynamic from 'next/dynamic';
// const { Option } = Select;

// import { useEffect, useState } from "react";

// import { PlusOutlined, EditOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';

// import AddCondition from '../Element/Condition/Add';

// const initialCondtion = {
//     cKey: '', key: null, value: '', type: ''
// }

// const ContentEditor = dynamic(
//     () => import('@/components/Panel/RightPanel/Setting/Element/Value/ContentEditor'), {
//     ssr: false
// })

// import MediaModal from "@/components/dashboard/Media/MediaModal";


// export default function ElementContent({ state, setState,
//     setIsChange }) {


//     const [condition, setCondition] = useState(null);

//     const [mediaModal, setMediaModal] = useState(false);
//     const [vmediaModal, setVMediaModal] = useState(false);



//     const onChangeContent = (content) => {

//         setState({ ...state, nodeValue: content })
//         setIsChange(true);

//     }

//     const onChangeState = (keys) => {


//         if (keys === undefined || keys[0] === undefined)
//             setState({ ...state, state: undefined })
//         else {
//             const key = [...keys];
//             const first = key[0];
//             key.shift()
//             setState({ ...state, state: { key, type: first } })
//         }

//         setIsChange(true);
//     }

//     const handleValuesChange = (e) => {
//         let values = e.target.value.split(',');

//         if (!Array.isArray(state.states))
//             state.states = [];

//         values = values.map((value) => {

//             const val = value.split("|");

//             return { label: val[1], value: val[0], selected: val[2] }
//         })

//         state.options = [...values];
//         setState({ ...state });
//         setIsChange(true);
//     };

//     const handleValueChange = (e) => {
//         const nodeValue = e.target.value;

//         setState({ ...state, nodeValue });
//         setIsChange(true);
//     };

//     const handleLabelChange = (e) => {
//         const label = e.target.value;

//         setState({ ...state, label });
//         setIsChange(true);
//     };

//     const onChangeLabelPos = (val) => {
//         const label = val;
//         setState({ ...state, labelPos: label });
//         setIsChange(true);
//     };



//     const onAddCondition = (value) => {
//         setCondition(null);
//     }

//     const onChangeImage = (image) => {


//         const newImage = image[0] ? image[0] :
//             { _id: -1, src: '', alt: '' }

//         setState({
//             ...state,
//             src: newImage
//         });
//         setIsChange(true);

//     }

//     const onChangeMedia = (media) => {

//         const newMedia = Array.isArray(media) ? media :
//             []

//         setState({
//             ...state,
//             srcs: newMedia
//         });
//         setIsChange(true);

//     }

//     const onChangePoster = (image) => {

//         const newImage = image[0] ? image[0] :
//             { _id: -1, src: '', alt: '' }

//         setState({
//             ...state,
//             poster: newImage.src
//         });
//         setIsChange(true);

//     }


//     const onRemoveCondition = () => {
//     }

//     return (
//         <>
//             <Form layout="vertical"
//                 initialValues={{}}
//             >


//                 {(state.tagName == 'select' || state.tagName == 'input' || state.tagName == 'textarea') ? <>
//                     {(state.attributes?.find(x => x.key === 'type')?.value == 'checkbox' || state.attributes?.find(x => x.key === 'type')?.value == 'radio' || state.tagName == 'select') ? <>

//                         <Form.Item
//                             label="Enter option values separated by | e.g value|label|isSelected? (0, 1)"

//                         >
//                             <Input.TextArea value={state.options?.map(s => `${s.value}|${s.label ? s.label : ''}|${s.selected ? s.selected : ''}`)} onChange={handleValuesChange} />
//                         </Form.Item>


//                     </> : <>

//                         <Form.Item
//                             label="Enter Label"

//                         >
//                             <Input value={state.label} onChange={handleLabelChange} />
//                         </Form.Item>

//                         <Form.Item label="Enter Default Value">
//                             {state.tagName == 'textarea' ? <Input.TextArea value={state.nodeValue} onChange={handleValueChange} /> :
//                                 <Input type={state.attributes?.find(x => x.key === 'type')?.value} value={state.nodeValue} onChange={handleValueChange} />}
//                         </Form.Item>


//                     </>}
//                     {state.tagName !== 'select' && <>



//                         <Select style={{ width: '100%' }} value={state.labelPos} onChange={onChangeLabelPos}>
//                             {[

//                                 { label: 'Label Before', value: 0 },
//                                 { label: 'Label After', value: 1 },
//                             ].map(option => (
//                                 <Option key={option.value} value={option.value}>
//                                     {option.label}
//                                 </Option>
//                             ))}
//                         </Select>

//                     </>}
//                 </> :

//                     (state.tagName == 'video' || state.tagName == 'audio') ? <>

//                         <Form.Item label="Srcs">
//                             <Button onClick={() => setVMediaModal(true)} icon={<UploadOutlined />}>Upload</Button>

//                             {Array.isArray(state.srcs) && state.srcs.map((src, index) => (
//                                 <p key={index}>{src.name}</p>
//                             ))}
//                         </Form.Item>

//                         {state.tagName == 'video' && <Form.Item label="Poster">
//                             <Image
//                                 width="100%"
//                                 onClick={() => setMediaModal(true)}
//                                 preview={false}
//                                 style={{
//                                     width: '100%',
//                                     objectFit: 'cover',
//                                     objectPosition: 'center',
//                                     height: '120px',
//                                     cursor: 'pointer'
//                                 }}
//                                 alt="video poster"
//                                 src={state.poster}
//                                 fallback="/images/default/default-img.png" />
//                         </Form.Item>} </>
//                         : state.tagName == 'img' ? <Form.Item label="Image">

//                             <Image
//                                 width="100%"
//                                 onClick={() => setMediaModal(true)}
//                                 preview={false}
//                                 style={{
//                                     width: '100%',
//                                     objectFit: 'cover',
//                                     objectPosition: 'center',
//                                     height: '120px',
//                                     cursor: 'pointer'
//                                 }}
//                                 alt={state.src?.alt}
//                                 src={state.src?.src}
//                                 fallback="/images/default/default-img.png" />
//                         </Form.Item> :

//                             <Form.Item label="Content" className="font-500">
//                                 <ContentEditor content={state.nodeValue} onSave={onChangeContent} />
//                             </Form.Item>}


//                 <Divider orientation="center" orientationMargin="0">Dynamic Value</Divider>


//                 <Cascader
//                     options={state.cascaderStates}
//                     onChange={onChangeState}
//                     value={state.state ?
//                         [state.state.type, ...(Array.isArray(state.state.key) ? state.state.key : [])] : [undefined]}
//                     placeholder="Select State"
//                     expandTrigger="hover"
//                     style={{ marginBottom: 10, width: '100%' }}
//                 />


//                 <Divider orientation="center" orientationMargin="0"></Divider>



//                 {condition ? <AddCondition
//                     current={condition}
//                     onAdd={onAddCondition}
//                     setCurrent={setCondition}
//                     states={state.states} />

//                     : <div>

//                         {state.condition && <div style={{ paddingBottom: 10 }}>
//                             cond: <b>{state.condition.key} </b> <em>{state.condition.match}</em> {state.condition.value} &nbsp;
//                             <EditOutlined onClick={() => setCondition(state.condition)} />  &nbsp;
//                             <Popconfirm
//                                 title="Delete"
//                                 description="Are you sure to delete this condtion?"
//                                 onConfirm={() => onRemoveCondition()}
//                                 onCancel={() => { }}
//                                 okText="Yes"
//                                 cancelText="No"
//                             >
//                                 <MinusCircleOutlined />
//                             </Popconfirm>
//                         </div>}

//                         {!condition && !state.condition && <Button type="dashed" onClick={() => { setCondition(initialCondtion); }} icon={<PlusOutlined />}>
//                             {'Add'} Condition
//                         </Button>}

//                     </div>}

//             </Form>

//             {state.tagName == 'img' &&
//                 <MediaModal open={mediaModal} type={"images"} onClose={() => setMediaModal(false)} srcs={[state.src ? state.src : { _id: -1, src: '', alt: '' }]} onSelect={onChangeImage} />
//             }

//             {state.tagName == 'video' && <>
//                 <MediaModal open={mediaModal} type={"images"} onClose={() => setMediaModal(false)} srcs={[state.poster ? state.poster : { _id: -1, src: '', alt: '' }]} onSelect={onChangePoster} />

//                 <MediaModal open={vmediaModal} type={"videos"} multiple={true} onClose={() => setVMediaModal(false)} srcs={Array.isArray(state.srcs) ? state.srcs : []} onSelect={onChangeMedia} />
//             </>}

//             {state.tagName == 'audio' && <>

//                 <MediaModal open={vmediaModal} type={"audios"} multiple={true} onClose={() => setVMediaModal(false)} srcs={Array.isArray(state.srcs) ? state.srcs : []} onSelect={onChangeMedia} />
//             </>}
//         </>

//     );
// };



import { Form, Input, Button, Popconfirm, Divider, Cascader, Image, Select } from "antd";
import dynamic from 'next/dynamic';
const { Option } = Select;

import { useEffect, useState } from "react";

import { PlusOutlined, EditOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';

import ContentEditor from './ContentEditor'

import MediaModal from "@/components/Dashboard/Media/MediaModal";

import Video from "@/components/Dashboard/Media/Video";

export default function ElementContent({ cascaderStates, state, setState,
    setIsChange }) {

    const [mediaModal, setMediaModal] = useState(false);
    const [type, setType] = useState("images");

    const onChangeContent = (content) => {

        setState({ ...state, nodeValue: content })
        setIsChange(true);

    }

    const onChangeState = (keys) => {


        if (keys === undefined || keys[0] === undefined)
            setState({ ...state, state: undefined })
        else {
            const key = [...keys];
            const first = key[0];
            key.shift()
            setState({ ...state, state: { key, type: first } })
        }

        setIsChange(true);
    }

    const handleValuesChange = (e) => {
        let values = e.target.value;
        state.options = values;
        setState({ ...state });
        setIsChange(true);
    };


    const onChangeLabelPos = (val) => {
        const label = val;
        setState({ ...state, labelPos: label });
        setIsChange(true);
    };

    const onChangeMedia = (media) => {


        if (type == 'images') {
            setState({
                ...state,
                nodeValue: media[0].src,
                src: media[0]
            });
        }
        else {
            setState({
                ...state,
                srcs: media
            });
        }
        setIsChange(true);

    }

    const srcs =  type == 'images' ? state.src : [...(state.srcs ? state.srcs : [])];


    return (
        <>
            <Form layout="vertical"
                initialValues={{}}
            >

                {(['checkbox', 'radio'].includes(state.attributes['type']?.value) || state.tagName == 'select') ? <>
                    <Form.Item
                        label="Enter option values"
                    >
                        <Input.TextArea
                            placeholder="Enter option values separated by , and separated value and label by | e.g value1|label1,value2|label2"
                            value={state.options}
                            onChange={handleValuesChange}
                        />
                    </Form.Item>

                    {state.tagName !== 'select' &&
                        <Form.Item label="Label Position">
                            <Select style={{ width: '100%' }} value={state.labelPos} onChange={onChangeLabelPos}>
                                {[
                                    { label: 'Label Before', value: 0 },
                                    { label: 'Label After', value: 1 },
                                ].map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>}
                </>
                    :

                    (state.tagName == 'video' || state.tagName == 'audio') ? <>

                        <Form.Item label="srcs:">
                            <Button onClick={() => {
                                setType('videos')

                                setMediaModal(true)
                            }} icon={<UploadOutlined />}>Upload</Button>
                            <br/>
                            <br/>
                            {Array.isArray(state.srcs) && state.srcs.map((src, index) => (
                                <Video src={src.src} alt={src.alt} mimetype={src.mimetype} />
                            ))}
                        </Form.Item>
                        {state.tagName == 'video' && <Form.Item label="Poster">
                            <Image
                                width="100%"
                                onClick={() => {
                                    setType('images')

                                    setMediaModal(true)
                                }}
                                preview={false}
                                style={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    height: '120px',
                                    cursor: 'pointer'
                                }}
                                alt="video poster"
                                src={state.src?.src}
                                fallback="/images/default/default-poster.png" />
                        </Form.Item>} </>
                        : state.tagName == 'img' ?

                            <Form.Item label="Image">
                                {console.log(state.src)}
                                <Image
                                    width="100%"
                                    onClick={() => {
                                        setType('images')

                                        setMediaModal(true)
                                    }}
                                    preview={false}
                                    style={{
                                        width: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        height: '120px',
                                        cursor: 'pointer'
                                    }}
                                    alt={state.src?.alt}
                                    src={state.src?.src}
                                    fallback="/images/default/default-img.png" />

                            </Form.Item>

                            :


                            <Form.Item label="Content" className="font-500">
                                <ContentEditor disabled={state.tagName == 'hr'} state={state} onSave={onChangeContent} />
                            </Form.Item>
                }

                <Divider orientation="center" orientationMargin="0">Dynamic Value</Divider>


                <Cascader
                    disabled={state.tagName == 'hr'}
                    options={cascaderStates}
                    onChange={onChangeState}
                    value={state.state ?
                        [state.state.type, ...(Array.isArray(state.state.key) ? state.state.key : [])] : [undefined]}
                    placeholder="Select State"
                    style={{ marginBottom: 10, width: '100%' }}
                />

            </Form>

            <MediaModal open={mediaModal} 
            multiple={type == 'videos'}
            type={type} 
            onClose={() => setMediaModal(false)} srcs={srcs} onSelect={onChangeMedia} />

        </>

    );
};

