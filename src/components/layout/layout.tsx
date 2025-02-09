// components/layout/Layout.tsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LayoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Navigation = styled.nav`
  ul {
    display: flex;
    gap: 2rem;
    list-style: none;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  a {
    color: var(--text);
    text-decoration: none;
    
    &:hover {
      color: var(--primary);
    }
  }
`;

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <LayoutContainer>
            <Header>
                <h1>Workout Timer</h1>
                <Navigation>
                    <ul>
                        <li><Link to="/">Timers</Link></li>
                        <li><Link to="/add">Add Timer</Link></li>
                        <li><Link to="/history">History</Link></li>
                    </ul>
                </Navigation>
            </Header>
            <main>{children}</main>
        </LayoutContainer>
    );
};
