import React from 'react'
import Text from '../Text';

interface Props {
    state?: "correct" | "contained" | "default"
    value?: string;
    onChange?: () => void;
}
const LetterField: React.FC<Props> = ({ 
    state = "default",
    value = "A",
    onChange
}) => {
    const styling = {
        correct: {
            bg: "bg-green"
        },
        contained: {
            bg: "bg-yellow"
        },
        default: {
            bg: "bg-secondary"
        },
    }
    const style = styling[state]
  return (
    <div 
    className={`${style.bg} br-md border-primary pad-md flex align-center justify-center drop-shadow`} 
    style={{height: "72px", width: "72px", boxSizing: "border-box"}}>
        <Text className={"text-headline-h1"}> {value} </Text>
    </div>
  )
}

export default LetterField