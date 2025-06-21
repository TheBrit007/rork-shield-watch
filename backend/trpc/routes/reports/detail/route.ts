import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { generateMockReports } from "@/mocks/reports";

export default publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    // For now, we're using mock data
    // In a real app, this would query a database
    const reports = generateMockReports();
    const report = reports.find(r => r.id === input.id);
    
    if (!report) {
      throw new Error("Report not found");
    }
    
    return { report };
  });