# QA Telebot

Telebot - the system that allows to create automatic Telegram shops

Consists of three main components : Wizard BOT, Shop BOT and WebSite

- Wizard Bot the Telegram bot that allows to create other shops
- Shop Bot the image of Telegram Bot that attached to User Bot
- WebSite serve internet pages

Main logic:

- Site
	- Works

- Wizard
	- Register new bot
		- Can't register the bot with same token
		- Only one bot per user for free account
	- Demo
		- Menu, Order, About works
	- Help
	- Language
		- En
		- Ru

- Shop
	- Menu, get list of items
	- Order
		- Make order from another account and get notification only for admin
		- Cancel order in the middle
	- About, show about text
	- Admin
		- Admin panel visibly only for Admin account
			<!-- - /admin command visibly and works only for Admin account -->
		- Change name, Change Name
		- Manage items, Add, Delete
      - Maximum 5 items
		- Manage pages
			- About, Description
			- Change text, 1024 symbols max, empty string not allowed

- Support
	- New ticket
	- Reply

To test:

- Main logic
- Changes from Changelog
- Validations, Buttons, Navigation, Content
- Any mistakes, typos and misunderstands in English
