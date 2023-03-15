import { EmbedBuilder } from 'discord.js';
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'signature',
      description: 'Get multisig addresses from treasuries',
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'co-op-treasury',
          description: 'Co-Op Treasury Addresses'
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'concave-treasury',
          description: 'Concave Treasury Addresses'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const currentDate = Math.floor(Date.now() / 1000);

    /*
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/AfFp7pu.png')
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true }
      )
      .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
      .setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp()
      .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
    */

    if (ctx.options['co-op-treasury']) ctx.send(`<t:${currentDate}:f>`);
    else if (ctx.options['concave-treasury']) {
      const embed = makeEmbed('concave-treasury');
      ctx.send({
        embeds: [embed]
      });
    }

    /*
    return ctx.options.food
      ? `You like ${ctx.options.food}? Nice!`
      : `HELLO, ${ctx.member?.displayName ?? ctx.user.username}!`;
    */
  }
}

function makeEmbed(commandName: string) {
  return new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Signature request')
    .addFields(
      { name: `A signature has been requested for ${commandName}`, value: '-' },
      { name: '\u200B', value: '\u200B' },
      { name: 'Address 1', value: '0.1 ETH' },
      { name: 'Address 1', value: '0.2 ETH' }
    )
    .toJSON();
}
