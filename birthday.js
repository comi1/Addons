const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle } = require("discord.js");
const birthday = require("../../Models/birthday");
const premium = require("../../Models/premium")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Create your birthday")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addIntegerOption(option =>
            option.setName("day")
                .setDescription("Day")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("month")
                .setDescription("Month 1, 2, 3, etc...")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("year")
                .setDescription("Year")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { channel, options } = interaction;
        const embed = new EmbedBuilder()
        .setTimestamp()
        await interaction.deferReply({embeds:[embed]})

        const premiumdata = await premium.findOne({Guild: interaction.guild.id})
        if(!premiumdata) return interaction.editReply({embeds:[embed.setDescription('This command is premium only!')]})

        const day = options.getInteger("day");
        const month = options.getInteger("month");
        const year = options.getInteger("year");
        const date = new Date()
        const godine = date.getFullYear() - year;
        const godinaSad = date.getFullYear()
        const godinaNext = date.getFullYear() + 1;
        const monthNow = date.getMonth() + 1

        let days = 365;
        let currentDay = date.getDate();
        let leftDays = 365 - currentDay;

        const db = await birthday.findOne({Guild: interaction.guild.id, User: interaction.user.id});

        if(date.getFullYear() - year < 13 || date.getFullYear() - year < 0 || year > date.getFullYear()){
            interaction.editReply({embeds:[
                embed
                .setTitle('Invalid Year')
                .setDescription(`Year can be 0 or you have 13 or bellow years`)
                .setColor('Red')
            ]})
        } else if (day < 1 || day > 31) {
            interaction.editReply({embeds:[
                embed
                .setTitle('Invalid Day')
                .setDescription(`Day can't be lest then 1 or higher then 31`)
                .setColor('Red')
            ]})
        } else if (month > 12 || month < 1) {
            interaction.editReply({embeds:[
                embed
                .setTitle('Invalid Month')
                .setDescription(`Month can't be lest then 1 or higher then 12`)
                .setColor('Red')
            ]})
        } else {
            if(month > monthNow) {
                interaction.editReply({embeds:[
                    embed
                    .setTitle('🎂 Birthday Added')
                    .setDescription(`Duly noted I will wish happy \`${godine + 1}th\` birthday to ${interaction.user}\n➥ ${godinaSad}/${month}/${day}`)
                    .setColor('Red')
                ]})
                if(!db) {
                    birthday.create({
                        Guild: interaction.guild.id, 
                        User: interaction.user.id,
                        Day: day,
                        Month: month,
                        Year: year
                    })
                } else if (db) {
                    db.Day = day;
                    db.Month = month;
                    db.Year = year;
                    db.save()
                }
            } else {
                interaction.editReply({embeds:[
                    embed
                    .setTitle('🎂 Birthday Added')
                    .setDescription(`Duly noted I will wish happy \`${godine + 1}th\` birthday to ${interaction.user}\n➥ ${godinaNext}/${month}/${day}`)
                    .setColor('Red')
                ]})
                if(!db) {
                    birthday.create({
                        Guild: interaction.guild.id, 
                        User: interaction.user.id,
                        Day: day,
                        Month: month,
                        Year: year
                    })
                } else if (db) {
                    db.Day = day;
                    db.Month = month;
                    db.Year = year;
                    db.save()
                }
            }
        }
    }
}