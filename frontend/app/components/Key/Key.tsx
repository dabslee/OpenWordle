import React from "react"
import "./Key.css"
import Text from "../Text"

export type KeyStatus = "absent" | "present" | "correct" | "default"

interface Props {
  letter: string
  status?: KeyStatus
}

const Key: React.FC<Props> = ({ letter, status = "default" }) => {
    const keyConfig = {
        "absent": {bg: 'bg-grey'},
        "present": {bg: 'bg-yellow'},
        "correct": {bg: 'bg-green'},
        "default": {bg: 'bg-transparent'},
    }
    const config = keyConfig[status]
    return (
        <div className={`key border-primary br-md ${config.bg}`}>
            <Text className={"text-headline-h2"}>{letter}</Text>
        </div>
    )
}

export default Key
