CREATE TABLE `admin` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tax` real NOT NULL,
	`shop_fee_threshold` real NOT NULL,
	`shop_fee_rate` real NOT NULL,
	`labor_rate` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `markup_matrix` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` real NOT NULL,
	`multiplier` real NOT NULL
);
