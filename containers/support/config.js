module.exports = {
  // bot settings
  bot_token: '', // @TelebotSupportBot
  staffchat_id: '', // Telebot Support group
  owner_id: 'YOUR_TELEGRAM_ID',
  spam_time: 5 * 60 * 1000, // time (in MS) in which user may send 5 messages

  // customize your language
  startCommandText: 'Welcome to Telebot support chat! Ask your question here.',
  faqCommandText: 'Check out FAQ here: <a href="https://telegra.ph/FAQ-08-13-5">https://telegra.ph/FAQ-08-13-5</a>',
  lang_contactMessage:
    `Thank you for contacting us. We will answer as soon as possible.`,
  lang_blockedSpam:
    `You sent quite a number of questions in the last while.
    Please calm down and wait until staff reviews them.`,
  lang_ticket: 'Ticket',
  lang_acceptedBy: 'was accepted by',
  lang_dear: 'Dear',
  lang_regards: 'Best regards,',
  lang_from: 'from',
  lang_language: 'Language',
  lang_msg_sent: 'Message sent to user',
  lang_usr_with_ticket: 'User with ticket',
  lang_banned: 'banned',
}