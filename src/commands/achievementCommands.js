const getSpaces = num => {
  let str = "";
  for (let i = 0; i < num; i++) {
    str += " ";
  }
  return str;
};

/*case "achievements":
        if (args[1] && args[1] === "rank") {
          const name = args[2] ? args[2] : "Phôenîx";
          const realm = "Draenor";
          axios
            .get(`http://127.0.0.1:8080/guild/ach?name=${name}&realm=${realm}`)
            .then(res => {
              message.reply(
                `${name}-${realm} is ranked ${res.data} on achievement points!`
              );
            });
          break;
        }
        axios.get("http://127.0.0.1:8080/guild").then(res => {
          const maxLength = res.data.reduce(
            (max, char) => (char.name.length > max ? char.name.length : max),
            0
          );
          const desc = res.data.reduce(
            (str, char) => (
              (str += `${char.name}${getSpaces(
                maxLength - char.name.length
              ) } - ${char.achievementPoints}\n`),
              str
            ),
            ""
          );
          logger.debug(maxLength);
          logger.debug(desc);
          const embed = new Discord.RichEmbed();
          embed.setTitle("Achievement point leaders");
          embed.setColor(16042818);
          embed.setDescription("```" + desc + "```");
          embed.setAuthor(bot.user.username, bot.user.avatarURL);
          embed.setFooter("© Illusions", bot.user.avatarURL);
          embed.setTimestamp(Date.now());
          //embed.addField("It is a field!", "Some **really** awesome field!");
          message.channel
            .sendEmbed(embed)
            .then(result => {
              logger.debug("Message sent!", result);
            })
            .catch(err => {
              logger.error("Error sending message!", err);
            });
        });
        break;
        */
