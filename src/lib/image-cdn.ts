import BunnyStorage from "bunnycdn-storage-ts";
import "dotenv/config";

const BunnyStorageInstance = new BunnyStorage(
	process.env.BUNNYCDN_API_KEY || "",
	process.env.BUNNYCDN_STORAGE_ZONE_NAME || "",
);

export default BunnyStorageInstance;
