import { useState, useEffect } from "react";
import MediaComponent from "@/components/Dashboard/Media";
import { fetcher } from "@/lib/fetch";
import { message, Button, Modal, Form, Input, Image, Space } from "antd";
import SingleImage from "./SingleImage";

export function ImageComponent() {

    const [images, setImages] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e) => {

        setSelectedImage({ ...selectedImage, [e.target.name]: e.target.value });
    };

    useEffect( () => {
        // try {

        //     setIsLoading(true);
        //     const id = localStorage.getItem("project");
        //     const response = await fetcher('/api/projects/' + id, {
        //         method: 'GET'
        //     });


        //     const _images = await fetcher(`http://${response.project.domain}:${response.project.port}/api/media?type=images`, {
        //         method: 'GET',
        //         headers: { 'x-api-key': response.project.apikey },
        //     });

        //     setImages(_images)

        // } catch (e) {
        //     message.error(e?.message || 'Something went wrong');
        // } finally {
        //     setIsLoading(false);
        // }

    }, []);

    const onAddMore = (newImages) => {
        setImages([...images, ...newImages])
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const onSave = async () => {
        try {
            setIsLoading(true);
            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
                method: 'GET'
            });


            const res = await fetcher(`http://${response.project.domain}:${response.project.port}/api/media/${selectedImage._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-api-key': response.project.apikey },
                body: JSON.stringify(selectedImage),
            });

            let index = images.indexOf(selectedImage);
            images[index] = res;

            setImages([...images]);

            setIsModalOpen(false);

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
                method: 'GET'
            });



            const res = await fetcher(`http://${response.project.domain}:${response.project.port}/api/media/${selectedImage._id}`, {
                method: 'Delete',
                headers: { 'x-api-key': response.project.apikey },
            });


            let index = images.indexOf(selectedImage);
            if (index !== -1) {
                images.splice(index, 1);
                setSelectedImage(null);

                setImages([...images]);
            }
            setIsModalOpen(false);




        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    return <MediaComponent type="images" onAdd={onAddMore}>
        <div className="ac-image-gallery" style={{ flexWrap: 'wrap' }}>
            {images && images.map(image => <SingleImage
                image={image}
                setImage={setSelectedImage}
                selectedImage={selectedImage}
                showModal={showModal} />
            )
            }


        </div>


        <Modal
            title="Eidt Image"
            visible={isModalOpen}
            onOk={onSave}
            okText="Save"
            onCancel={handleCancel}
            confirmLoading={isLoading}
        >
            <div className="wrapper" >

                <div style={{ display: 'flex', gap: 15 }}>
                    <div>
                        <Image
                            width={200}
                            height={200}
                            src={selectedImage?.path || "/images/default/default-img.png"}
                            fallback="/images/default/default-img.png" preview={true} />
                    </div>

                    <div>
                        <Form layout="vertical">

                            <Space direction="vertical" className="wrapper">
                                <Form.Item label="Media Name" className="font-500">
                                    <Input placeholder="Name" name="name"
                                        onChange={onChange}
                                        value={selectedImage?.name}
                                        required />
                                </Form.Item>

                                <Form.Item label="Media Alt" className="font-500">
                                    <Input placeholder="alt text" name="alt"
                                        onChange={onChange}
                                        value={selectedImage?.alt}
                                        required />
                                </Form.Item>
                            </Space>

                            <Button type="danger" loading={isLoading} onClick={onDelete}> Delete </Button>

                        </Form>
                        <br />
                        <br />
                    </div>
                </div>

            </div>
        </Modal>

    </MediaComponent>
};

