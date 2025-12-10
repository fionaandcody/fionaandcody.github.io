
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    const existing = await prisma.vacation.findUnique({
        where: { slug: 'honeymoon-maui-2022' },
    });

    if (!existing) {
        await prisma.vacation.create({
            data: {
                title: 'Honeymoon in Maui',
                slug: 'honeymoon-maui-2022',
                destination: 'Maui, Hawaii',
                startDate: new Date('2022-09-15'),
                endDate: new Date('2022-09-25'),
                shortSummary: 'Our magical honeymoon exploring the Road to Hana and relaxing on the beaches of Wailea.',
                description: 'Ten days of pure bliss. from the sunrise at Haleakala to the turtles at Hookipa Beach.',
                coverImage: 'https://images.unsplash.com/photo-1542259648-812328dff1f1?q=80&w=2940&auto=format&fit=crop',
                tags: JSON.stringify(['Honeymoon', 'Hawaii', 'Beach', 'Relaxing']),
                gallery: JSON.stringify([
                    'https://images.unsplash.com/photo-1545251142-f32339074946?q=80&w=2938&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1570726190240-c7554f3eb864?q=80&w=2835&auto=format&fit=crop'
                ]),
                status: 'published',
                featured: true,
            },
        });
        console.log('Creates sample vacation: Honeymoon in Maui');
    } else {
        console.log('Sample vacation already exists');
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
