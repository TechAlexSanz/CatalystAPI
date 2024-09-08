import { initializeServer } from '@server/server';
import apiRoutes from '@routes/routes';

const startServer: Promise<void> = initializeServer(apiRoutes);

export default startServer;
