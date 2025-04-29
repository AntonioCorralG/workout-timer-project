import 'styled-components';
import { theme } from './components/generic/styles/theme';

type ThemeType = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
