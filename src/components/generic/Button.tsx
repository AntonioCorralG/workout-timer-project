import styled from "styled-components";

export type ButtonType = "button" | "submit" | "reset" | "start" | "pause" | "remove" | "edit";

interface ButtonStyleProps {
  type: ButtonType;
  height: number;
  width: number;
}

interface ButtonProps extends ButtonStyleProps {
  children: React.ReactNode;
  onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

const StyledButton = styled.button<ButtonStyleProps>`
    background-color: ${(p) => {
    switch (p.type) {
      case "start":
        return "#3b89a8";
      case "pause":
        return "#DBD225";
      case "reset":
        return "#864451";
      case "edit":
        return "#3E535C";
      default:
        return "#3E535C";
    }
  }};
    height: ${props => props.height}px;
    width: ${props => props.width}px;
    border: none;
    border-radius: 10px;
    padding: 0.5rem;
    margin: 0.25rem;
    cursor: pointer;
    font-weight: 700;
    color: #b8bebf;

    &:hover {
        background-color: #db2549;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
            background-color: inherit;
        }
    }

    &:focus-visible {
        outline: 2px solid #3b89a8;
        outline-offset: 2px;
    }
`;

const Button = ({
  children,
  type,
  height,
  width,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
}: ButtonProps) => {
  return (
    <StyledButton
      type={type}
      height={height}
      width={width}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </StyledButton>
  );
};

export default Button;