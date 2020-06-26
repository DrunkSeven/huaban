/**
 * 全局状态
 */
import { PPT } from './../model/PPT'
export default {
    time: 0,
    isplay: false,//回放播放状态
    currentTime: 0,//当前播放进度
    duration: 0,//回放视频的时长
    pptObj: { slide: 1, step: 0, pptId: 1 }
}