import { TENNIS } from '../data/sports/tennis';
import { SportGuide, type SportVisual } from './SportGuide';
import { RacketDiagram } from './tennis/RacketDiagram';
import { GripOctagon } from './tennis/GripOctagon';
import { SplitStep } from './tennis/SplitStep';
import { ForehandChain } from './tennis/ForehandChain';
import { BackhandHands } from './tennis/BackhandHands';
import { ServePhases } from './tennis/ServePhases';
import { ShoulderRotation } from './tennis/ShoulderRotation';

const VISUALS: Record<string, SportVisual> = {
  racket: {
    render: () => <RacketDiagram />,
    caption: '球拍的四個部位',
    note: '拍長上限 73.66 公分、拍寬上限 31.75 公分（ITF）。',
    legend: [
      '拍頭：外框，決定拍面大小與容錯。',
      '拍面：線床，擊球時變形再回彈，是力量與旋轉的來源。',
      '拍喉：連接拍頭與握把，影響揮拍時的風阻與穩定。',
      '握把：尺寸以圍長標示，太細會讓人握太緊。',
    ],
  },
  grip: {
    render: () => <GripOctagon />,
    caption: '四種握法：手掌一格格往握把下方轉',
    note: '圖是握把的橫切面，深色是手掌接觸的面，虛線是虎口方向。',
    legend: [
      '大陸式：手掌在握把側面，發球與截擊使用。',
      '東方式：手掌移到握把後方，拍面略開，適合平擊。',
      '半西方式：再往下一格，最常見的現代正手握法。',
      '西方式：手掌轉到握把下方，拍面較關，適合高球。',
    ],
  },
  splitStep: {
    render: () => <SplitStep />,
    caption: '準備姿勢：站直（左）與預備（右）',
    note: '右圖是側面。膝微彎、球拍在身前，落地後第一步往外跨。',
    legend: [
      '膝微彎 15–20 度，重心在前腳掌。',
      '球拍舉在身前，拍頭朝上，縮短引拍。',
      '落地後第一步要大，不要只伸手。',
    ],
  },
  forehand: {
    render: () => <ForehandChain />,
    caption: '正手動力鏈（側面，右手持拍）',
    note: '虛線箭頭是力量傳遞的順序，不是要五個部位同時用力。',
    legend: [
      '踩地：外側腳壓進地面，是動力的起點。',
      '髖：骨盆先轉，帶動下半身。',
      '軀幹：胸廓跟著轉，幅度比骨盆大。',
      '肩：肩膀最後才開，不是第一個動作。',
      '拍頭：前臂旋轉把拍頭甩出去，擊球點在身體前外側。',
    ],
  },
  backhand: {
    render: () => <BackhandHands />,
    caption: '反手握法（由上往下看）',
    note: '左：雙手反手，兩手上下相鄰。右：單手反手，手臂延伸角度更大。',
    legend: [
      '雙手反手：非慣用手在上，負責方向；慣用手只負責穩定。',
      '單手反手：只有持拍手，擊球點要在身體更前面。',
    ],
  },
  serve: {
    render: () => <ServePhases />,
    caption: '發球八階段與三個時期',
    note: '八階段是分析工具；實際發球是一個連續動作，不需要默數八拍。',
    legend: [
      '1 起始：側身站，前腳指向目標。',
      '2 拋球釋放：手臂伸直往上，球在身前上方。',
      '3 屈膝蓄力：膝彎、髖屈，重心壓進前腳。',
      '4 持拍手舉高：肩外轉、拍頭朝下。',
      '5 加速：蹬地，軀幹前傾。',
      '6 擊球：手臂幾乎伸直、拍面方正。',
      '7 減速：手臂往對側收。',
      '8 收拍：重心進場，準備下一球。',
    ],
  },
  shoulder: {
    render: () => <ShoulderRotation />,
    caption: '肩內轉與外轉（由上往下看）',
    note: '手肘固定在 90 度、上臂貼著身體；圖是示意，實際角度要用量測比較兩側。',
    legend: [
      '外轉：前臂往外轉，發球蓄力時的角度。',
      '內轉：前臂往內轉，收拍與加速時的角度。',
      '兩側差距明顯時，先做活動度與肩胛控制訓練。',
    ],
  },
};

interface TennisGuideProps {
  minutes: number;
  onBack: () => void;
}

export function TennisGuide({ minutes, onBack }: TennisGuideProps) {
  return <SportGuide content={TENNIS} visuals={VISUALS} minutes={minutes} onBack={onBack} />;
}
