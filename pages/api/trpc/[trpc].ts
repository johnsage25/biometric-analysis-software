import * as trpcNext from '@trpc/server/adapters/next';
import { appRouterMain } from '../../../server/routers/_app';
import { createContext } from '../../../server/createContext';

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouterMain,
  createContext:createContext
});
