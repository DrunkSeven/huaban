export function parseElement(htmlString) {//将html字符串转为node节点
    console.log(new DOMParser().parseFromString(htmlString, 'text/html'));

    return new DOMParser().parseFromString(htmlString, 'text/html').head.childNodes[0]
}