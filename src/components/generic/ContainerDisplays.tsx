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
    font-size: 2rem;
    margin-bottom: 1rem;
    height: 40px;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: right;
    max-width: 300px;
    background-color: #3b89a8;
    color: #b8bebf;
`;

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
    display: flex;
    flex-direction: column;
    margin-right: 20px;
`;

export const StyledButtonContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 400px;
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