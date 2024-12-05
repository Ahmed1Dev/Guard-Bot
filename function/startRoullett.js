const {
    startTime,
    chooseTimeout,
    timeBetweenRounds,
} = require("../config.json");
const { createWheel } = require("../wheel.js");
const {
    createButtonRows,
    editButton,
    commands,
    emojis,
    sleep,
} = require("../utils.js"); // Error: TypeError: startGame.startGame is not a function? star



// خرا عليكي فانكشن
module.exports.startGame = async function (interaction, start = false) {
     const { players } = (await Games.get(interaction.guildId)) || { players: [] };
    if (players.length == 0) {
        await sleep(5);
        interaction.channel.send({
            content: client.langauge.RouletteCanceld,
        });
        return;
    }
    if (start) {
        await interaction.channel.send({
            content: client.language.RouletteStarting,
        });
    }
    await sleep(timeBetweenRounds);
    let colorsGradient = [
        "#3F0000", "#5F0000", "#7F0000", "#9F0000", "#BF0000",
        "#DF0000", "#FF0000", "#FF3333", "#FF6666", "#FF9999",
        "#FFCCCC", "#FFB3B3", "#FF9999", "#FF8080", "#FF6666",
        "#FF4C4C", "#FF3333", "#FF1A1A", "#FF0000", "#E60000",
        "#CC0000", "#B30000", "#990000", "#800000", "#660000",
        "#4C0000", "#330000", "#1A0000", "#000000", "#0D0000",
        "#1A0D0D", "#2A1A1A", "#3A2626", "#4A3333", "#5A4040",
        "#6A4D4D", "#7A5959", "#8A6666", "#9A7373", "#AA8080",
        "#B98C8C", "#C99999", "#D6A6A6", "#E3B3B3", "#F0C0C0",
        "#F5D6D6", "#F9E3E3", "#FCECEC", "#FDFDFD", "#F4D8D8",
        "#C71585", "#D1417F", "#D8667F", "#E1857F", "#E8A56F",
        "#F0C19D", "#F6D1A8", "#F8DAC2", "#F9E3D2", "#FCE7E4",
        "#FFEBE4", "#FFDED6", "#FDD1D1", "#F8B8B8", "#F4A4A4",
        "#F09393", "#E87070", "#E55353", "#D94747", "#C53030",
        "#A51F1F", "#8C1717", "#741212", "#5D0A0A", "#450000"
    ];


    const options = players.map((user, index) => ({
        user: user,
        label: user.username,
        color: colorsGradient[index % colorsGradient.length],
    }));

    const winnerOption = options[Math.floor(Math.random() * options.length)];
    const winnerIndex = options.indexOf(winnerOption);
    options[winnerIndex] = {
        ...winnerOption,
        winner: true,
    };

    const savedData = await Games.get(interaction.guildId);
    const time = Date.now() + chooseTimeout * 1000;
    savedData.winner = { id: winnerOption.user.user, until: time };
    await Games.set(interaction.guildId, savedData);
    const image = await createWheel(options, winnerOption.user.avatar);

    const buttons = players
        .filter((user) => user.username != winnerOption.label)
        .map((user) =>
            new ButtonBuilder()
                .setCustomId(`kick_${user.user}`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(user.username)
                .setEmoji(emojis[Number(user.buttonNumber) - 1]),
        );

    const leaveButton = new ButtonBuilder()
        .setCustomId(`withdrawal`)
        .setLabel("Withdrawal")
        .setStyle(ButtonStyle.Danger);

    const rows = createButtonRows([...buttons, leaveButton]);

    const attachment = new AttachmentBuilder(image, { name: "wheel.png" });

    if (players.length <= 2) {
        const embed = new EmbedBuilder()
            .setImage("attachment://wheel.png")
            .setColor("#4876a3")
            .setDescription(
                client.language.RouletteLastRoundTwo,
            );
        await interaction.channel.send({
            content: client.language.RouletteLastRound
                .replace("[number]", `${winnerOption.user.buttonNumber}`)
                .replace("[user]", `<@${winnerOption.user.user}>`),
            files: [attachment],
        });
        //   interaction.channel.send(client.language.RouletteWin.replace("[user]", `<@${winnerOption.user.user}>`))
        await Games.delete(interaction.guildId);


        const RoPlay = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel(client.language.RouletteAgain)
                .setCustomId(`PlayRoullet`)
                .setStyle(2)
                .setEmoji(`🎮`)
        );
        await interaction.channel.send({
            content: client.language.RouletteWin.replace("[user]", `<@${winnerOption.user.user}>`),
            components: [RoPlay]
        });
    } else {
        const embed = new EmbedBuilder()
            .setImage("attachment://wheel.png")
            .setColor("#4876a3")
            .setDescription(
                client.language.RouletteChoose.replace("[time]", `${chooseTimeout}`),
            );
        await interaction.channel.send({
            content: client.language.RouletteChooseTwo.replace("[time]", `${chooseTimeout}`),
            files: [attachment],
        });
        await interaction.channel.send({
            content: `**<@${winnerOption.user.user}>**`,
            components: rows,
        });
        setTimeout(async () => {
            const checkUser = await Games.get(interaction.guildId);
            if (
                checkUser?.winner.id == winnerOption.user.user &&
                checkUser.winner.until == time
            ) {
                checkUser.players = checkUser.players.filter(
                    (player) => player.user != winnerOption.user.user,
                );
                checkUser.winner.id = "";

                await Games.set(interaction.guildId, checkUser);

                interaction.channel.send(
                    client.language.RouletteKicked.replace("[kickedUser]", `<@${winnerOption.user.user}>`)
                );

                startGame(interaction);
            }
        }, chooseTimeout * 1000);
    }
};