import styled from "styled-components";



export const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  font-size: 1rem;

  input {
    margin-top: 5px;
    padding: 8px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    outline: none;
    width: 100%;
  }
`;

export const TimerStyle = styled.div`
    border: 1px solid rgba(184, 190, 191, 0.1);
    padding: ${({ theme }) => theme.spacing.lg};
    margin: ${({ theme }) => theme.spacing.md};
    background: rgba(62, 83, 92, 0.2);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    transition: ${({ theme }) => theme.transitions.default};
    position: relative;
    overflow: hidden;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.primary},
            ${({ theme }) => theme.colors.accent}
        );
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.large};
    }
`;

export const TotalTimeDisplay = styled.div`
    font-size: 2.5rem;
    margin: ${({ theme }) => theme.spacing.lg} 0;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.primary};
    background: rgba(62, 83, 92, 0.2);
    backdrop-filter: blur(8px);
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: 12px;
    border: 1px solid rgba(184, 190, 191, 0.1);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    animation: pulse 2s infinite ease-in-out;
`;