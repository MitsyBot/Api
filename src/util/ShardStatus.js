module.exports = class ShardStatus {
   
   constructor() {
    this.status = new Map();
  }

   getAllShards() {
    const ping = Array.from(this.status.values());

    return ping.map(a => {
      return {
        ...a,
      };
    });
  }

  putShard(shardId, shardData) {
    this.status.set(shardId, shardData);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShardStatus();
    }

    return this.instance;
  }
}