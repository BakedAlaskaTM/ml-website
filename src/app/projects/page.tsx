import { prisma } from '@/lib/prisma'

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
            {projects.map((project) => (
                <div>
                    <h1>{project.name}</h1>
                    <h2>{project.slug}</h2>
                    <p>{project.description}</p>
                    <p>{project.map_count}</p>
                </div>
            ))}
        </div>
    )
}