import { liveQuery } from "dexie";
import { db } from "./local-db";
import { supabase } from "./supabase";

export async function syncData() {
	console.log("Syncing data...");

	// Fetch from Supabase and populate IndexedDB
	const { data: entrepreneurs, error: entrepreneurError } = await supabase
		.from("entrepreneurs")
		.select("*");
	if (entrepreneurError) {
		console.error(
			"Error fetching entrepreneurs from Supabase:",
			entrepreneurError,
		);
	} else if (entrepreneurs) {
		await db.entrepreneurs.bulkPut(entrepreneurs);
		console.log("Entrepreneurs synced from Supabase");
	}

	const { data: businesses, error: businessError } = await supabase
		.from("businesses")
		.select("*");
	if (businessError) {
		console.error("Error fetching businesses from Supabase:", businessError);
	} else if (businesses) {
		await db.businesses.bulkPut(businesses);
		console.log("Businesses synced from Supabase");
	}

	// Listen for changes in IndexedDB and push to Supabase
	liveQuery(() => db.entrepreneurs.toArray()).subscribe(
		async (entrepreneurs) => {
			if (entrepreneurs.length > 0) {
				const { error } = await supabase
					.from("entrepreneurs")
					.upsert(entrepreneurs);
				if (error) {
					console.error("Error syncing entrepreneurs to Supabase:", error);
				}
			}
		},
	);

	liveQuery(() => db.businesses.toArray()).subscribe(async (businesses) => {
		if (businesses.length > 0) {
			const { error } = await supabase.from("businesses").upsert(businesses);
			if (error) {
				console.error("Error syncing businesses to Supabase:", error);
			}
		}
	});
}
