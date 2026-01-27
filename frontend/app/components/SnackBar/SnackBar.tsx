import React, { useEffect, useState } from "react"
import "./SnackBar.css"
import Icon from "../Icon/Icon"
import Text from "../Text"
import { COLORS } from "../../styling/colors"

interface Props {
    variant?: "error" | "success"
    message?: string
    duration?: number // ms
}

const SnackBar: React.FC<Props> = ({ variant = "error", message, duration = 3000 }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return

    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration])

  if (!message) return null

  const bgColor = variant === "error" ? "bg-red" : "bg-green"

  return (
    <div className={`snackbar ${bgColor} drop-shadow border-primary row gap-sm align-center br-md pad-sm ${visible ? "snackbar--show" : ""}`}>
        <Icon name={variant === "error" ? "error" : "check"} size="24px" color={COLORS.white}/>
        <Text className={'text-headline-h3 text-primary-reverse'}>{message}</Text>
    </div>
  )
}

export default SnackBar
