import { useState, useEffect } from "react";
import { Card, Modal, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import Link from "next/link";
import { EditOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
const { Meta } = Card;
import ThemeServices from "@/lib/services/theme";
import Template from "./Template";
import usePageStates from "@/components/Editor/PageProvider";
import { fetcher } from "@/lib/fetch";

import { ModalTemplate } from "@/components/Editor/Element/Template";

const TemplateList = ({ templates }) => {

    const [template, setTemplate] = useState(null);
    const { setCurrentPage, getCurrentPage } = usePageStates();
    const [isLoading, setIsLoading] = useState(false);

    const [openTemplate, setOpenTemplate] = useState(false);


    const showTemplateModal = (temp) => {
        setTemplate(temp)
        setOpenTemplate(true);
    };
    const handleTemplateOk = (e) => {
        setTemplate(null)
        setOpenTemplate(false);
    };


    useEffect(() => {

        const _id = localStorage.getItem('activePage');

        const template = templates.find(c => c._id === _id);

        if (template) {
            template.type = 'template';
            setCurrentPage(template);
        }

    }, [templates]);


    const onDelete = async (_id) => {
      
        try {
            setIsLoading(true);

            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
                method: 'GET'
            });

            const url = `http://${response.project.domain}:${response.project.port}`


            await ThemeServices.deleteTemplate(_id, url, response.project.apikey);

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }

    }

    return (<>

                {templates.map((temp) =>
                    <Card
                        hoverable
                        style={{ width: 'auto', marginBottom: 10, border: temp === getCurrentPage() ? '1 solid var(--primary)' : null }}
                        cover={
                            <div style={{ padding: 5 }}><img
                                alt="template view" style={{
                                    width: "100%",
                                    maxHeight: "300px"
                                }}
                                src={temp.screenShot}
                            />
                            </div>
                        }
                        actions={[
                            <EditOutlined key="edit" onClick={(e) => {
                                e.preventDefault();
                                temp.type = "template";
                                localStorage.setItem("activePage", temp._id)
                                setCurrentPage(temp)
                            }} />,
                            <SettingOutlined key="setting" onClick={(e) => { e.preventDefault(); showTemplateModal(temp); }} />,
                            <DeleteOutlined key="delete" onClick={(e) => { e.preventDefault(); onDelete(temp._id) }} />,
                        ]}
                    ><Template template={temp}>
                            <Meta
                                title={temp.name}
                                description={temp.desc}
                            />
                        </Template>
                    </Card>
                )}

        <Modal
            title="Edit Template"
            closable
            open={openTemplate}
            onOk={handleTemplateOk}

            modalRender={(modal) => (

                <div>

                    {modal}


                </div>
            )}


        ><div style={{ marginTop: 30 }}>{template && <ModalTemplate template={template} />} </div></Modal>


    </>
    );
};

export default TemplateList;
