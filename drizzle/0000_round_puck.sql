CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100),
	`price` decimal(10,2),
	`images` json,
	`contact_info` json,
	`published` boolean DEFAULT false,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_configuration` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contact_type` varchar(50) NOT NULL,
	`contact_info` varchar(500) NOT NULL,
	`order` int DEFAULT 0,
	`active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_configuration_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entity_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_type` varchar(50) NOT NULL,
	`entity_id` int NOT NULL,
	`language` varchar(10) NOT NULL DEFAULT 'it',
	`field` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entity_translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section_id` int,
	`parent_id` int,
	`link` varchar(500),
	`order` int DEFAULT 0,
	`active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order` int DEFAULT 0,
	`active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`template` varchar(100),
	`published` boolean DEFAULT false,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `entity_idx` ON `entity_translations` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `language_idx` ON `entity_translations` (`language`);