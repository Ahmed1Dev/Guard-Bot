const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, BitField } = require('discord.js');
const ms = require(`ms`);
const humanizeDuration = require('humanize-duration');

module.exports = {
  name: 'role',
  description: "Give/Remove role to/from a user",
  options: [
    {
      name: "add_or_remove",
      description: "Choose The Type",
      type: 3,
      required: true,
      choices: [
        {
          name: "Add",
          value: "Give"
        },
        {
          name: "Remove",
          value: "Remove"
        },
      ],
    },
    {
      name: "target",
      description: "Select a user",
      type: 6,
      required: true
    },
    {
      name: "role",
      description: "Select the role",
      type: 8,
      required: true
    }
  ],
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  userPerms: ['ManageChannels'],
  botPerms: ['ManageChannels'],
  run: async (client, interaction) => {
    try {
      let user = interaction.options.getMember("target")
      let choice = interaction.options.getString("add_or_remove") // fixed typo
      let role = interaction.options.getRole("role")

      let embeds = {
        Give: new EmbedBuilder()
          .setColor("#1ABF00")
          .setDescription(client.language.RoleAdd.replace('[user]', user.user.username).replace('[role]', role.name)),
        Remove: new EmbedBuilder()
          .setColor("#1ABF00")
          .setDescription(client.language.RoleRemove.replace('[user]', user.user.username).replace('[role]', role.name)),
        NotHaveRole: new EmbedBuilder()
          .setColor("#1ABF00")
          .setDescription(client.language.donthaveRole.replace('[user]', user.user.username, 'role', role.name))
      }

      if (interaction.member.roles.highest.position <= role.position && interaction.guild.ownerId!== interaction.member.id) return interaction.reply({
        content: client.language.RoleRoleHigher
      })
      if (user.roles.highest.position >= interaction.member.roles.highest.position && interaction.guild.ownerId!== user.user.id) return interaction.reply({
        content: client.language.userHigherThenYou
      })

      switch (choice) {
        case 'Give':
          if (user.roles.cache.has(role.id)) {
            return interaction.reply({
              embeds: [embeds.NotHaveRole]
            })
          }
          await user.roles.add(role);
          await interaction.reply({
            embeds: [embeds.Give]
          })
          break;
        case 'Remove':
          if (!user.roles.cache.has(role.id)) {
            return interaction.reply({
              embeds: [embeds.NotHaveRole]
            })
          }
          await user.roles.remove(role);
          await interaction.reply({
            embeds: [embeds.Remove]
          })
          break;
      }

    } catch (err) {
      console.log(err)
    }
  }
};
