import StyleComponent from "./Style";
import { Button } from "antd";
import { useNodeStates, useCssNodeStates } from "@/components/Editor/PageProvider";
import { useEffect } from "react";


export default function Styling({ states }) {

    const { node, setUState} = useNodeStates();
    const { isLoading } = useCssNodeStates();

   

    return <div className="wrapper">
        <h2>{node?.element.tagName} </h2>

        <StyleComponent currentNode={node?.ref} isLoading={isLoading} states={states} setUState={setUState} />
    </div>


}