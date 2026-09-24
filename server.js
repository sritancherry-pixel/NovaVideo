import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import crypto from "crypto";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const jobs = new Map();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static("public"));
app.use("/generated", express.static("generated"));
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
app.get("/api/health", (_req,res)=>res.json({ok:true,provider:"Google Veo 3.1",configured:!!ai}));
app.post("/api/generate", async (req,res)=>{
  if(!ai) return res.status(500).json({error:"GEMINI_API_KEY is not configured on the server."});
  const {prompt,aspectRatio="9:16"}=req.body||{};
  if(!prompt?.trim()) return res.status(400).json({error:"Prompt is required."});
  const jobId=crypto.randomUUID();
  jobs.set(jobId,{status:"queued",progress:5,videoUrl:null,error:null});
  res.json({jobId,status:"queued"});
  createVeoJob(jobId,prompt.trim(),aspectRatio).catch(err=>jobs.set(jobId,{status:"failed",progress:100,videoUrl:null,error:err?.message||"Video generation failed."}));
});
app.get("/api/generate/:jobId",(req,res)=>{const job=jobs.get(req.params.jobId);if(!job)return res.status(404).json({error:"Job not found."});res.json(job)});
async function createVeoJob(jobId,prompt,aspectRatio){
  jobs.set(jobId,{status:"generating",progress:15,videoUrl:null,error:null});
  let op=await ai.models.generateVideos({model:"veo-3.1-generate-preview",prompt,config:{aspectRatio:aspectRatio==="16:9"?"16:9":"9:16"}});
  while(!op.done){
    await new Promise(r=>setTimeout(r,5000));
    op=await ai.operations.getVideosOperation({operation:op});
    const progress=Number(op.metadata?.progressPercent??50);
    jobs.set(jobId,{status:"generating",progress:Math.min(95,Math.max(15,progress)),videoUrl:null,error:null});
  }
  const video=op.response?.generatedVideos?.[0]?.video;
  if(!video) throw new Error("Veo returned no generated video.");
  const out=path.join("generated",`${jobId}.mp4`);
  await ai.files.download({file:video,downloadPath:out});
  jobs.set(jobId,{status:"complete",progress:100,videoUrl:`/generated/${jobId}.mp4`,error:null});
}
app.listen(PORT,()=>console.log(`NovaVideo V1 running at http://localhost:${PORT}`));
