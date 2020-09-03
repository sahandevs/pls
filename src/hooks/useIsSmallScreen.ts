import { useMediaQuery } from '@material-ui/core';

export function useIsSmallScreen() {
  return useMediaQuery('(max-width:425px)');
}
