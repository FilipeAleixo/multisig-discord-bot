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
    if(ctx.options['co-op']) return 'co-op';
    else if(ctx.options['concave']) return 'concave';
    /*
    return ctx.options.food
      ? `You like ${ctx.options.food}? Nice!`
      : `HELLO, ${ctx.member?.displayName ?? ctx.user.username}!`;
    */
  }
}
