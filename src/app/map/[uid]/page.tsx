import { prisma } from '@/lib/prisma'

export default async function MapRecords(props: { params: Promise<{ uid: string }> }) {
    const params = await props.params

    const records = await prisma.record.findMany({
        where: {
            map_uid: params.uid
        },
        select: {
            time: true,
            driven_on: true,
            leaderboard: true,
            PlayerIdentity: {
                select: {
                    username: true,
                    external_id: true,
                }
            }
        }
    })

    return (
        <div>
            <table>
                <th>
                    <td>time</td>
                    <td>leaderboard</td>
                    <td>login</td>
                    <td>nickname</td>
                    <td>date driven</td>
                </th>
                {records.map((record) => (
                    <tr>
                        <td>{record.time}</td>
                        <td>{record.leaderboard}</td>
                        <td>{record.PlayerIdentity.external_id}</td>
                        <td>{record.PlayerIdentity.username}</td>
                        <td>{record.driven_on?.toDateString()}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}