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
      const owners = await getOwners(COOP_TREASURY_ADDRESS);
      const embed = makeEmbed('co-op-treasury', owners);
      ctx.send({
        embeds: [embed]
      });
    } else if (ctx.options['concave-treasury']) {
      const owners = await getOwners(CONCAVE_TREASURY_ADDRESS);
      const embed = makeEmbed('concave-treasury', owners);
      ctx.send({
        embeds: [embed]
      });
    }
  }
}

function makeEmbed(commandName: string, owners: any) {
  const currentDate = Math.floor(Date.now() / 1000);

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Signature request')
    .addFields(
      { name: `A signature has been requested for ${commandName}`, value: `at <t:${currentDate}:f>` },
      { name: '\u200B', value: '\u200B' }
    );

  for (const o of owners) {
    embed.addFields({ name: o.address, value: `**Balance**: ${o.balance} ETH, **Nonce**: ${o.nonce}` });
  }

  return embed.toJSON();
}

async function getOwners(treasuryAddress: string) {
  const contract = new ethers.Contract(treasuryAddress, gnosisSafeAbi, provider);
  var addresses = await contract.getOwners();

  const owners = [];
  const balancePromises = [];
  const noncePromises = [];

  for (const a of addresses) {
    const balance = provider.getBalance(a);
    balancePromises.push(balance);
    const nonce = provider.getTransactionCount(a);
    noncePromises.push(nonce);
  }

  // parallel for quicker command response
  const [balances, nonces] = await Promise.all([
    Promise.all(balancePromises),
    Promise.all(noncePromises)
  ]);

  for (const [i, a] of addresses.entries()) {
    const balanceEther = ethers.utils.formatEther((+balances[i]).toFixed(4));
    owners.push({ address: a, balance: balanceEther, nonce: nonces[i] });
  }

  return owners;
}
