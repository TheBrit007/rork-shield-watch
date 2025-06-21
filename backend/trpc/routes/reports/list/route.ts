import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { Report } from "@/types";
import { generateMockReports } from "@/mocks/reports";

// This is a server-side procedure to get reports
export default publicProcedure
  .input(
    z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      radius: z.number().optional(),
      limit: z.number().optional().default(50),
    })
  )
  .query(({ input }) => {
    // For now, we're using mock data
    // In a real app, this would query a database
    const reports = generateMockReports();
    
    // If location parameters are provided, we could filter by proximity
    if (input.latitude && input.longitude && input.radius) {
      // This is a simple distance calculation - in a real app you'd use a more accurate formula
      const filteredReports = reports.filter(report => {
        const distance = Math.sqrt(
          Math.pow(report.latitude - input.latitude!, 2) + 
          Math.pow(report.longitude - input.longitude!, 2)
        );
        // Convert degrees to approximate kilometers (very rough approximation)
        const distanceKm = distance * 111;
        return distanceKm <= input.radius!;
      });
      
      return {
        reports: filteredReports.slice(0, input.limit),
        total: filteredReports.length
      };
    }
    
    // Return all reports if no location filtering
    return {
      reports: reports.slice(0, input.limit),
      total: reports.length
    };
  });