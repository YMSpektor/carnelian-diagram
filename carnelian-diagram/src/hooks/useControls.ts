import { ComponentChild } from "../jsx-runtime";
import { renderContext } from "..";

export type RenderControlsCallback = (transform: DOMMatrixReadOnly) => JSX.Element;

export function useControls(callback: RenderControlsCallback) {
    let curNode = renderContext.currentNode;
    if (curNode) {
        const oldCallback = curNode.data?.renderControlsCallback;
        curNode.data = curNode.data || {};
        curNode.data.renderControlsCallback = !oldCallback ? callback : (transform) => {
            return [oldCallback, callback]
                .reduce<ComponentChild[]>((acc, cur) => acc.concat(cur(transform)), []);
        }
    }
}