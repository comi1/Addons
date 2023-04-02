
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const birthday = require("../../Models/birthday")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("birthdayremove")
        .setDescription("Remove your birthday")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction, client) {

        await interaction.deferReply()

        const date = new Date()
        const year = date.getFullYear()

        const embed = new EmbedBuilder()

        const data = await birthday.findOne({Guild: interaction.guild.id, User: interaction.user.id});
        if (!data) {
            return interaction.editReply({embeds:[
                embed
                .setTitle('Your birthday does not exist!')
                .setDescription(`I con not remove \`Unknown\` birthday ...`)
                .setTimestamp()
                .setColor('Red')
            ]})
        } else {
            data.delete()
            return interaction.editReply({embeds:[
                embed
                .setTitle('Birthday Deleted')
                .setDescription(`${interaction.user} - Your birthday has been removed from this server.`)
                .setTimestamp()
                .setColor('Green')
            ]})
        }
    }
}