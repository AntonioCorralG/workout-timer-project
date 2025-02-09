import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const LayoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
    background: rgba(62, 83, 92, 0.3);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    border: 1px solid rgba(184, 190, 191, 0.1);
`;

const Navigation = styled.nav`
    padding: ${({ theme }) => theme.spacing.md} 0;
    
    ul {
        display: flex;
        justify-content: center;
        gap: ${({ theme }) => theme.spacing.lg};
        list-style: none;
        padding: 0;
        margin: 0;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: center;
        }
    }
`;

const StyledNavLink = styled(NavLink)`
    display: inline-block;
    color: ${({ theme }) => theme.colors.text.secondary};
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    border-radius: 8px;
    transition: all ${({ theme }) => theme.transitions.default};
    position: relative;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: 0.9rem;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
        transform: translateY(-2px);
    }

    &.active {
        color: ${({ theme }) => theme.colors.primary};
        background: rgba(59, 137, 168, 0.1);
        border: 1px solid ${({ theme }) => theme.colors.primary}40;
    }
`;


const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: 2.5rem;
    text-align: center;
    position: relative;
    padding-bottom: ${({ theme }) => theme.spacing.md};

    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 3px;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.primary},
            ${({ theme }) => theme.colors.accent}
        );
        border-radius: 3px;
    }
`;

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutContainer>
      <Header>
        <Title>Workout Timer</Title>
        <Navigation>
          <ul>
            <li><StyledNavLink as={NavLink}
              to="/" className={({ isActive }) => isActive ? 'active' : ''}
            >Timers</StyledNavLink></li>
            <li><StyledNavLink as={NavLink}
              to="/add" className={({ isActive }) => isActive ? 'active' : 'theme.colors.primary'}
            >Add Timer</StyledNavLink></li>
            <li><StyledNavLink as={NavLink}
              to="/history" className={({ isActive }) => isActive ? 'active' : ''}
            >History</StyledNavLink></li>
          </ul>
        </Navigation>
      </Header>
      <main>{children}</main>
    </LayoutContainer>
  );
};
