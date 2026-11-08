import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const fiches = (await redis.get("fiches")) || {};
      return res.status(200).json(fiches);
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      await redis.set("fiches", body || {});
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ erreur: "Méthode non autorisée" });
  } catch (e) {
    return res.status(500).json({ erreur: String(e) });
  }
}
