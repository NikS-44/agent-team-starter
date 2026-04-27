-- Fix DBs that ran an older 0001 with `last4` instead of `card_number`.
-- Clears payment_methods; server startup re-seeds when the table is empty.
DROP TABLE IF EXISTS `payment_methods`;
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`brand` text NOT NULL,
	`card_number` text NOT NULL,
	`label` text,
	`exp_month` integer,
	`exp_year` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
