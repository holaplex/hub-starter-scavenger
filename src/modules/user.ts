import { PrismaClient } from "@prisma/client";
import { Collector } from "@/graphql.types";

export default class UserSource {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async get(email: string | null | undefined): Promise<Collector | undefined> {
    if (!email) {
      return;
    }

    const user = await this.db.user.findFirst({
      where: { email },
    });

    return user as Collector;
  }
}
