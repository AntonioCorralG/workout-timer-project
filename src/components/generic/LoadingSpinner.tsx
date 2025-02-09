import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid var(--background);
  border-top: 5px solid var(--primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingSpinner = () => (
    <SpinnerContainer>
        <Spinner role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
    </SpinnerContainer>
);