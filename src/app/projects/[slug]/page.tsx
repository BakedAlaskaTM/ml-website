import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ProjectPage(props: { params: Promise<{ slug: string }>}) {
    const params = await props.params

    const project = await prisma.project.findUnique({
        where: {
            slug: params.slug
        },
        select: {
            name: true,
            description: true,
            started_at: true,
            status: true,
            ProjectMap: {
                select: {
                    Map: true,
                }
            }
        }
    })

    const maps = project?.ProjectMap.map((projectMap) => projectMap.Map) ?? [];

    return (
        <div>
            <ul>
                {maps.map((map) => (
                    <li key={map.uid}>
                        <Link href={`/map/${map.uid}`}>
                            <p>{map.name}</p>
                            <p>{map.author_time}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}