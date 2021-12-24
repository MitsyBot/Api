module.exports = class Activities {

    static getDefaultActivities() {
        return [
            {
              name: 'Yay',
              type: 'PLAYING',
            },
            {
              name: ':)',
              type: 'PLAYING',
            },
          ];
    }
    constructor() {
        this.activities = Activities.getDefaultActivities();
      }

      getAllActivities() {
        return this.activities;
      }

      getRandomActivity(shardId) {
        const randomActivity = this.activities[Math.floor(Math.random() * this.activities.length)];
        return { name: `${randomActivity.name} | Shard ${shardId}`, type: randomActivity.type };
      }

      addActivity(name, type) {
        this.activities.push({ name, type });
      }

      clearActivities() {
        this.activities = [];
      }

      resetActivities() {
        this.activities = Activities.getDefaultActivities();
        return this.activities;
      }

      static getInstance() {
        if (!this.instance) {
          this.instance = new Activities();
        }

        return this.instance;
    }
}
