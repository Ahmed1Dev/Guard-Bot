const emojis = require('../function/emojis.json')
module.exports = {
    
    // General Response
    bug: `${emojis.xMark} **Hello Dear**, \n Please report this bug to our [support server](https://discord.gg/U2F7QvyJDS). \n Thank you.`,
    ping: `${emojis.checkMark} Pong!`,
    notFound: `**${emojis.xMark} [user] not found.**`,
    noReason: `**${emojis.xMark} No reason specified.**`,
    
    
    // Lock & Unlock Response
    lock: `**${emojis.lock} [channel] has been locked.**`,
    unlock: `**${emojis.lock} #[channel] has been unlocked.**`,
    alreadyLocked: `**${emojis.xMark} This channel is already unlocked**`,
    
    // Ban & unBan Response
    cantBan: `**${emojis.xMark} You can't ban yourself!**`,
    higherRole: `** ${emojis.xMark} Your role cannot ban higher role**`,
    BanRolePosition: `** ${emojis.xMark} I can't ban this user then higher of me, Please Check my role position.**`,
    higherSelf: `** ${emojis.xMark} You can't ban this user**`,
    ban: `${emojis.checkMark} **@[user] has banned from the server!** ${emojis.Planet}`,
    fetchBans: `**${emojis.xMark} There are no banned users.**`,
    unbanAll: `${emojis.checkMark} **[size]** members being unbanned.`,
    unbanUser: `${emojis.checkMark} **@[user] has been unbanned**`,
    
    // Kick Response
    cantkick: `${emojis.xMark} **You can\'t kick yourself!**`,
    kickMe: `${emojis.xMark} **You can\'t kick me!**`,
    KickRolePosition: `** ${emojis.xMark} I can't Kick this user then higher of me, Please Check my role position.**`,
    kick: `${emojis.checkMark} @[user] has been kicked`,
    
    // Clear Response
    clear: `**${emojis.checkMark} Successfully deleted \`[messageCount]\` messages**`,
    
    // Mute & unMute Response
    mute: `${emojis.mute} @[user] has Muted for [time]!`,
    unmute: `${emojis.checkMark} @[user] has been unmuted!`,
    notMuted: `${emojis.rolling} @[user] **is not muted.**`,
    ThereMutedRole: `${emojis.xMark} **There is no Muted role in this server!**`,
    mutedcant: `${emojis.rolling} You cannot unmute [user] because they have a higher or equal role to you!**`,
    NotInVoice: `${emojis.xMark} **user is not in a voice channel!**`,
    vunmute: `**@[user] unmute from voice channel!**`,
    vmute: `${emojis.speakX} @[user] **has Muted from voice channel!**`,
    memberPosision: `${emojis.rolling} **You cannot mute [user] because they have a higher or equal role to you!**`,
    
    // Roles Response
    RoleAdd: `${emojis.checkMark} | [user] Changed roles, **+[role]**`,
    RoleRemove: `${emojis.checkMark} | [user] Changed roles, **-[role]**`,
    donthaveRole: `${emojis.xMark} - **[user] doesn't have this role**, \`@[role]\`**`,
    RoleRoleHigher: `${emojis.rolling}** - This role is higher than your**`,
    userHigherThenYou: `${emojis.rolling} **- This user is higher than you or you both have the same role**`,
    
    // Warn Response
    noWarnID: `${emojis.xMark} **Warn is not Found!**`,
    warned: `You're Warned ${emojis.Warn}!`,
    warnRemoved: `${emojis.checkMark} **[WarnID] has been removed.**`,
    noWarn: `${emojis.xMark} **[user] doesn't have any warns.**`,
    warnDone: `${emojis.checkMark} **[user] has been warned ${emojis.Warns}**`,
    warnRemoved: `${emojis.Warn} \`[WarnID]\` **Warn has removed!**`,
    ThereNoWarns: `${emojis.Warn} **There are no warnings in the server.**`,
    

    // Timeout & unTimeout Response
    vaildTime: `${emojis.xMark} **Specify a vaild time!**`,
    timeout: `**${emojis.speakX} [user] has been timeout for **[time].**`,
    untimeout: `**${emojis.checkMark} [user] has been untimeout.**`,

}