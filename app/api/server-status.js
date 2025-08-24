import { getServerStatus } from '../../utils/minecraftStatus';

export async function GET() {
    const status = await getServerStatus('SEU_IP_DO_SERVIDOR');
    return Response.json(status);
}