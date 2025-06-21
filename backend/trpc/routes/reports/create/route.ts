import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { MediaItem } from "@/types";

// Define the input schema for creating a report
const createReportSchema = z.object({
  agencyId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().min(1),
  media: z.array(
    z.object({
      uri: z.string(),
      type: z.enum(["image", "video"]),
    })
  ).optional().default([]),
  userId: z.string().optional(),
  username: z.string().optional(),
});

export default publicProcedure
  .input(createReportSchema)
  .mutation(async ({ input }) => {
    // In a real app, this would save to a database
    // For now, we'll just return a success response with a generated ID
    
    const newReport = {
      id: `report-${Date.now()}`,
      ...input,
      timestamp: Date.now(),
      upvotes: 0,
      verified: false,
      media: input.media || [],
    };
    
    return {
      success: true,
      report: newReport,
    };
  });