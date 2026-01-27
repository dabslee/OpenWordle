import React from 'react'

interface Props {
    children?: any;
    style?: any;
}
const Container: React.FC<Props> = ({ 
    children,
    style
}) => {
  return (
    <div className={"col align-center pad-y-xl"} style={{textAlign: 'center', width: "1032px", ...style}}>
        {children}
    </div>
  )
}

export default Container