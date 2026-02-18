const { Client, GatewayIntentBits, Partials, Events } = require("discord.js");

const TARGET_ROLE_NAME = "狩猟王";
const TARGET_EMOJI = "🎮";

// Render などで設定する環境変数から読む（絶対にコードに直書きしない）

if (!TOKEN) {
  console.error("❌ BOT_TOKEN が設定されていません。環境変数 BOT_TOKEN を設定してください。");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  // partial 対策（メッセージ/リアクションが未取得の場合に取得する）
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err) {
      console.error("リアクション取得失敗:", err);
      return;
    }
  }

  if (reaction.emoji.name !== TARGET_EMOJI) return;

  const guild = reaction.message.guild;
  if (!guild) return;

  const role = guild.roles.cache.find((r) => r.name === TARGET_ROLE_NAME);

  if (!role) {
    await reaction.message.channel.send(`⚠️ ロール「${TARGET_ROLE_NAME}」が見つかりません`);
    return;
  }

  await reaction.message.channel.send(`${role} 一狩り行こうぜ！`);
});

client.login(process.env.BOT_TOKEN);

