import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        where: {
            is_active: true,
        },
        select: {
            name: true,
            slug: true,
            description: true,
            map_count: true
        }
    })
    return (
        <div>
            <ul>
                {projects.map((project) => (
                    <li key={project.slug}>
                        <Link href={`/projects/${project.slug}`}>
                            <div>
                                <h1>{project.name}</h1>
                                <h2>{project.slug}</h2>
                                <p>{project.description}</p>
                                <p>{project.map_count}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}