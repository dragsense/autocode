'use client';

import { useState } from "react";
import { EditorLayout } from "../Layout";
import PageProvider from "./PageProvider";
import CanvasEditor from "./Canvas";
import Editor from './Editor';

export default function EditorComponent({ user }) {

   

    return (

        <PageProvider>
            <EditorLayout user={user} >
                    <Editor />
            </EditorLayout>
        </PageProvider>
    );
};