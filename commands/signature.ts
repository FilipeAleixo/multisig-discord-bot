import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'signature',
      description: 'Get multisig addresses from treasuries',
    });
  }

  async run(ctx: CommandContext) {
    return 'Works'
    /*
    return ctx.options.food
      ? `You like ${ctx.options.food}? Nice!`
      : `HELLO, ${ctx.member?.displayName ?? ctx.user.username}!`;
    */
  }
}
