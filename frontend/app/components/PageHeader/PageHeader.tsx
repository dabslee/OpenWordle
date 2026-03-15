import React from "react";
import Text from "../Text";
import Icon from "../Icon/Icon";
import { COLORS } from "@/app/styling/colors";

interface Props {
  title: string;
  subTitle?: string;
  variant?: "default" | "icon";
  iconProps?: React.ComponentProps<typeof Icon>;
}
const PageHeader: React.FC<Props> = ({
  title,
  subTitle,
  variant = "default",
  iconProps,
}) => {
  return (
    <div
      className="col gap-sm border-primary br-xl pad-md bg-primary-reverse"
      style={{ width: "100%" }}
    >
      <div className="row justify-between align-center">
        <Text className={"text-headline-h1 text-primary-reverse"}>{title}</Text>
        {variant === "icon" && iconProps && <Icon {...iconProps} size="24px" />}
      </div>
      {subTitle && (
        <Text className={"text-body-b2 text-secondary"}>{subTitle}</Text>
      )}
    </div>
  );
};

export default PageHeader;
