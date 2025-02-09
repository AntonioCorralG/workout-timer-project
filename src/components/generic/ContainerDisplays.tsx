import styled from "styled-components";

interface ContainerProps {
    maxWidth?: string;
    padding?: string;
}

export const TimerContainer = styled.div<ContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: ${props => props.maxWidth || '100%'};
    padding: ${props => props.padding || '1rem'};
`;

export const TimerDisplay = styled.div`
    font-size: 3rem;
    font-weight: bold;
    margin: ${({ theme }) => theme.spacing.md} 0;
    padding: ${({ theme }) => theme.spacing.md};
    background: rgba(59, 137, 168, 0.15);
    border: 1px solid rgba(59, 137, 168, 0.2);
    border-radius: 12px;
    color: ${({ theme }) => theme.colors.text.primary};
    text-align: center;
    min-width: 280px;
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        transform: scale(1.02);
        box-shadow: ${({ theme }) => theme.shadows.large};
    }`;

export const DisplayRounds = styled.div`
    font-size: 2rem;
    margin-bottom: 1rem;
    height: 40px;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: right;
    max-width: 300px;
`;

export const ButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
    max-width: 800px;
    margin: 0 auto ${({ theme }) => theme.spacing.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    background: rgba(62, 83, 92, 0.2);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    border: 1px solid rgba(184, 190, 191, 0.1);

    // Make the play/pause button span full width
    > button:first-child {
        grid-column: 1 / -1;
        justify-self: center;
        width: 80%;
        max-width: 300px;
        background: linear-gradient(
            135deg,
            ${({ theme }) => theme.colors.primary},
            ${props => props.theme.colors.buttonBg}
        );
        border: 1px solid rgba(184, 190, 191, 0.2);
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: ${({ theme }) => theme.shadows.medium};
            background: ${({ theme }) => theme.colors.primary};
        }
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;


export const StyledButtonContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: center;
    margin-top: ${({ theme }) => theme.spacing.md};
`;

export const FormContainer = styled.div<ContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${props => props.padding || '20px'};
    max-width: ${props => props.maxWidth || '500px'};
    margin: auto;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

export const TimerDescription = styled.div`
    font-size: 1.2rem;
    color: #666;
    margin-top: 0.5rem;
`;