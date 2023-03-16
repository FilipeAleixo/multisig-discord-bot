import { EmbedBuilder } from 'discord.js';
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { ethers } from 'ethers';
import { gnosisSafeAbi } from '../abi/gnosisSafe';

const COOP_TREASURY_ADDRESS = '0x93249D69636124ab311798F047dC1a8a94dd0a9E';
const CONCAVE_TREASURY_ADDRESS = '0x226e7AF139a0F34c6771DeB252F9988876ac1Ced';

// Connect to the network
const provider = new ethers.providers.JsonRpcProvider(
  'https://eth-mainnet.g.alchemy.com/v2/zKkc6wPRATuMBbFtdUwsE2J8ilGTa4SQ'
);

export default class SignatureCommand extends SlashCommand {
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

    if (ctx.options['co-op-treasury']) {
      const ownersBalances = await getOwners(COOP_TREASURY_ADDRESS);
      console.log({ownersBalances});
      const embed = makeEmbed('co-op-treasury', ownersBalances);
      ctx.send({
        embeds: [embed]
      });
    } else if (ctx.options['concave-treasury']) {
      const ownersBalances = await getOwners(CONCAVE_TREASURY_ADDRESS);
      const embed = makeEmbed('concave-treasury', ownersBalances);
      ctx.send({
        embeds: [embed]
      });
    }
  }
}

function makeEmbed(commandName: string, ownersBalances: any) {
  const currentDate = Math.floor(Date.now() / 1000);

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Signature request')
    .addFields(
      { name: `A signature has been requested for ${commandName} at <t:${currentDate}:f>`, value: '-' },
      { name: '\u200B', value: '\u200B' }
    );

  for (const ob of ownersBalances) {
    embed.addFields({ name: ob.address, value: ob.balanceEther });
  }

  return embed.toJSON();
}

async function getOwners(treasuryAddress: string) {
  const contract = new ethers.Contract(treasuryAddress, gnosisSafeAbi, provider);
  var addresses = await contract.getOwners();
  const ownersBalances = [];

  const promises = [];

  for (const a of addresses) {
    const balance = provider.getBalance(a);
    promises.push(balance);
  }
  // parallel for quicker command response
  const balances = await Promise.all(promises);

  for (const [i, b] of balances.entries()) {
    const balanceEther = ethers.utils.formatEther(b);
    ownersBalances.push({ address: addresses[i], balanceEther });
  }

  return ownersBalances;
}
