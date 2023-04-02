
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const birthday = require("../../Models/birthday")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("birthdaylist")
        .setDescription("Get all birthdays")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction, client) {

        await interaction.deferReply()

        const date = new Date()
        const year = date.getFullYear()

        

        const dd = await birthday.findOne({Guild: interaction.guild.id});
        if (!dd) {
            return interaction.editReply({content:`No data founded for ${interaction.guild.name}`, ephemeral: true})
        }

        const rawLeaderboard = await birthday.find({ Guild: interaction.guild.id }).limit(10).sort(([['Year', 'ascending']]));

        if (!rawLeaderboard) {
            return interaction.editReply({content:`No data founded for ${interaction.guild.name}`, ephemeral: true})
        }
        
        const lb = rawLeaderboard.map((e , i) => `**${i + 1}.** - <@!${e.User || "Unknown"}> - *${e.Day}/${e.Month}/${e.Year} - (${year - e.Year} years old)*`).join('\n');
        const embed = new EmbedBuilder()
        .setTitle('🎂 Birthday List')
        .setDescription(`${lb}\n\n \`[ day/month/year ]\``)
        .setFooter({text:`Birthdays founded for - ${interaction.guild.name} (${interaction.guild.id})`})
        .setTimestamp()
        .setColor('Blue')
        interaction.editReply({embeds: [embed]})
 
    }
}