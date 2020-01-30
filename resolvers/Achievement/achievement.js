const Query = {
    /**
     * Gets all achievements
     *
     * @param {string} authUserId
     * @param {int} skip how many achievements to skip
     * @param {int} limit how many achievements to limit
     */
    getAchievements: async (root, { authUserId, skip, limit }, { Profile }) => {
        const query = {
            $and: [{ author: { $ne: authUserId } }, { nationalism: [{ $ne: String }] }, { scientific: [{ $ne: String }] }, { occupational: [{ $ne: String }] }],
        };
        const achievementsCount = await Profile.find(query).countDocuments();
        const allAchievements = await Profile.find(query)
            .populate({
                path: 'author',
                populate: [
                    {
                        path: 'notifications',
                        populate: [
                            { path: 'author' },
                            { path: 'nationalism' },
                            { path: 'scientific' },
                            { path: 'occupational' },
                        ],
                    },
                ],
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 'desc' });

        return { achievements: allAchievements, count: achievementsCount };
    },
    /**
     * Gets Achievement from followed users
     *
     * @param {string} userId
     * @param {int} skip how many Achievement to skip
     * @param {int} limit how many Achievement to limit
     */
    /**
     * Gets Achievement by id
     *
     * @param {string} id
     */
    getAchievement: async (root, { id }, { User }) => {
        const achievement = await User.findById(id)
            .populate({
                path: 'author',
                populate: [
                    {
                        path: 'notifications',
                        populate: [
                            { path: 'author' },
                            { path: 'nationalism' },
                            { path: 'scientific' },
                            { path: 'occupational' },
                        ],
                    },
                ],
            })
        return achievement;
    },
};

const Mutation = {
    /**
     * Creates a new achievement
     *
     * @param {string} nationalism
     * @param {string} scientific
     * @param {string} occupational
     * @param {string} profileId
     */
    createAchievement: async (
        root,
        { input: { nationalism, scientific, occupational, profileId, authorId, achievementId } },
        {  Profile, Achievement }
    ) => {
        
        const newAchievement = await new Achievement({
            occupational,
            scientific,
            nationalism,
            author: authorId,
            profile: profileId,
          }).save();
      
          // Push achievement to invitation collection
          await Profile.findOneAndUpdate(
            { _id: achievementId },
            { $push: { achievement: newAchievement.id } }
          );
      
          return newAchievement;
    },
    /**
     * Deletes a user achievement
     *
     * @param {string} id
     */
    deleteAchievement: async (
        root,
        { input: { id} },
        { Profile, Achievement }
    ) => {

        const achievement = await Achievement.findByIdAndRemove(id);

        // Delete achievement from profile collection
        await Profile.findOneAndUpdate(
          { _id: achievement.author },
          { $pull: { achievements: achievement.id } }
        );

        return achievement;
    },
};

export default { Query, Mutation };
