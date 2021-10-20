const ShardStatus = require('../managers/ShardStatus');

module.exports = class ShardStatusController {
  static async getShardStatus(_req, res) {
    const shards = ShardStatus.getInstance().getAllShards();

    return res.json(shards);
  }

  static updateShardStatus(req, res) {
    const { shards } = req.body.data;

    shards.forEach((shard) => {
      const { memoryUsed, uptime, guilds, unavailable, ping, lastPingAt, members, id } = shard;
      const data = {
        id: Number(id),
        memoryUsed,
        uptime,
        guilds,
        unavailable,
        ping,
        lastPingAt,
        members,
      };
      ShardStatus.getInstance().putShard(Number(id), data);
    });

    return res.sendStatus(200);
  }
}