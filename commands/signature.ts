import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'signature',
      description: 'Get multisig addresses from treasuries',
      options: [
        {          
          type: CommandOptionType.SUB_COMMAND,
          name: "co-op",
          description:
            "Co-Op Treasury Addresses",
        },
        {          
          type: CommandOptionType.SUB_COMMAND,
          name: "concave",
          description:
            "Concave Treasury Addresses",
        },
      ]
    });
  }

  async run(ctx: CommandContext) {
    const currentDate = Math.floor(Date.now() / 1000);
    if(ctx.options['co-op']) ctx.send(`<t:${currentDate}:f>`);
    else if(ctx.options['concave']) return currentDate;

    /*
    return ctx.options.food
      ? `You like ${ctx.options.food}? Nice!`
      : `HELLO, ${ctx.member?.displayName ?? ctx.user.username}!`;
    */
  }
}
