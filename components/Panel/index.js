import { useEffect, useState } from "react";
import { EdtitorLeftSideBar } from "../SideBar";
import { EditorRightSideBar } from "../SideBar";

export function LeftPanelComponent() {

    return <EdtitorLeftSideBar />

};

export function RightPanelComponent({ onClickNavigator,
    onDeleteSelector, onUpdateSelector, onSelectSelector, onUpdate,
    onCopy, onDelete, onMove, state }) {


    return <EditorRightSideBar
        onUpdate={onUpdate}
        onDeleteSelector={onDeleteSelector}
        onSelectSelector={onSelectSelector}
        onUpdateSelector={onUpdateSelector}
        onMove={onMove}
        onDelete={onDelete}
        onCopy={onCopy}
        onClickNavigator={onClickNavigator}
        state={state} />

};


export default function SwitchComponents({ active, children }) {

    return children.filter(child => child.props.index === active)
}