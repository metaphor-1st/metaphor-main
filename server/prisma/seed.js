import { PrismaClient } from '@prisma/client';
import { Location, Pill, User } from './mock.js';

const prisma = new PrismaClient();

async function main() {
    try {
        // 기존 데이터 삭제
        await prisma.location.deleteMany({});
        await prisma.pill.deleteMany({});
        await prisma.user.deleteMany({});
        
        console.log("기존 데이터를 삭제했습니다.");

        // 목 데이터 삽입
        await prisma.location.createMany({
            data: Location,
            skipDuplicates: true,
        });
        console.log("Location 데이터를 삽입했습니다.");

        await prisma.pill.createMany({
            data: Pill,
            skipDuplicates: true,
        });
        console.log("Pill 데이터를 삽입했습니다.");

        await prisma.user.createMany({
            data: User,
            skipDuplicates: true,
        });
        console.log("User 데이터를 삽입했습니다.");
    } catch (error) {
        console.error("오류 발생:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
  .catch((e) => {
    console.error("스크립트 실행 중 오류 발생:", e);
    process.exit(1);
  });