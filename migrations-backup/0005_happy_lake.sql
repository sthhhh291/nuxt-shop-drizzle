CREATE TABLE `addresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`street` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip_code` text NOT NULL,
	`address_type` text NOT NULL,
	`customer_id` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email_address` text NOT NULL,
	`email_type` text NOT NULL,
	`customer_id` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `estimates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`hours_taken` real NOT NULL,
	`miles` integer NOT NULL,
	`estimate_type` text NOT NULL,
	`private_notes` text NOT NULL,
	`public_notes` text NOT NULL,
	`car_id` integer NOT NULL,
	FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `labor` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text NOT NULL,
	`hours` real NOT NULL,
	`rate` real NOT NULL,
	`price` real NOT NULL,
	`estimate_id` integer NOT NULL,
	FOREIGN KEY (`estimate_id`) REFERENCES `estimates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `oil` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`quantity` real NOT NULL,
	`price_per_unit` real NOT NULL,
	`estimate_id` integer NOT NULL,
	FOREIGN KEY (`estimate_id`) REFERENCES `estimates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `parts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mfr_number` text NOT NULL,
	`part_number` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`cost` real NOT NULL,
	`list` real NOT NULL,
	`unit_price` real NOT NULL,
	`estimate_id` integer NOT NULL,
	FOREIGN KEY (`estimate_id`) REFERENCES `estimates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `phones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phone_number` text NOT NULL,
	`phone_type` text NOT NULL,
	`customer_id` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`year` integer NOT NULL,
	`vin` text,
	`license` text,
	`fleet` text,
	`customer_id` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_cars`("id", "make", "model", "year", "vin", "license", "fleet", "customer_id") SELECT "id", "make", "model", "year", "vin", "license", "fleet", "customer_id" FROM `cars`;--> statement-breakpoint
DROP TABLE `cars`;--> statement-breakpoint
ALTER TABLE `__new_cars` RENAME TO `cars`;--> statement-breakpoint
PRAGMA foreign_keys=ON;