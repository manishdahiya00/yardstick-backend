import db from "../config/db";
import { hash } from "argon2";

async function main() {
    await db.tenant.createMany({
        data: [
            { name: "Acme", slug: "acme" },
            { name: "Globex", slug: "globex" },
        ],
        skipDuplicates: true,
    });

    const acme = await db.tenant.findUnique({ where: { slug: "acme" } });
    const globex = await db.tenant.findUnique({ where: { slug: "globex" } });

    if (!acme || !globex) {
        throw new Error("Tenants not created properly");
    }

    const defaultPassword = await hash("password");

    await db.user.createMany({
        data: [
            {
                name: "Admin",
                email: "admin@acme.test",
                password: defaultPassword,
                role: "MANAGER",
                tenantId: acme.id,
            },
            {
                name: "Member",
                email: "user@acme.test",
                password: defaultPassword,
                role: "MEMBER",
                tenantId: acme.id,
            },
            {
                name: "Admin",
                email: "admin@globex.test",
                password: defaultPassword,
                role: "MANAGER",
                tenantId: globex.id,
            },
            {
                name: "Member",
                email: "user@globex.test",
                password: defaultPassword,
                role: "MEMBER",
                tenantId: globex.id,
            },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Seeding completed");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
