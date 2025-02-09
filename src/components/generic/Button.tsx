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
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;

}

const StyledButton = styled.button<ButtonStyleProps>`
    background-color: ${(p) => {
    switch (p.type) {
      case "start":
        return p.theme.colors.primary;
      case "pause":
        return p.theme.colors.accent;
      case "reset":
        return p.theme.colors.secondary;
      case "edit":
        return p.theme.colors.primary;
      default:
        return p.theme.colors.primary;
    }
  }};
    height: ${props => props.height}px;
    width: ${props => props.width}px;
    border: none;
    border-radius: 10px;
    padding: ${({ theme }) => theme.spacing.sm};
    margin: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.error};
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
            background-color: inherit;
            transform: none;
        }
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.primary};
        outline-offset: 2px;
        box-shadow: ${({ theme }) => theme.shadows.medium};
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