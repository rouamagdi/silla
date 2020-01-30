const Query = {
    /**
     * Gets all Donation
     *
     * @param {string} authUserId
     * @param {string} nickname
     * @param {string} job
     * @param {string} Bio
     * @param {string} academicAertificate
     * @param {string} address
     * @param {string} location
     * @param {string} hobbys
     * @param {string} dateOfBirth
     * @param {string} memoryId
     * @param {string} achievementId
     * @param {string} authorId
     * @param {int} skip how many profiles to skip
     * @param {int} limit how many profiles to limit
     */
    getProfile: async (root, { id, memoryId, achievementId, authorId, authUserId }, { Profile }) => {
        const profile = await Profile.findById(id)
            .populate({
                path: 'author',
                populate: [
                    {
                        path: 'notifications',
                        populate: [
                            { path: 'author' },
                            { path: 'memory' },
                            { path: 'achievementt' },
                        ],
                    },
                ],
            })
            .populate('nickname')
            .populate('image')
            .populate('job')
            .populate('count')
            .populate('Bio')
            .populate('academicAertificate')
            .populate('address')
            .populate('location')
            .populate('hobbys')
            .populate('dateOfBirth');
        return donation;
    },
};

const Mutation = {
    /**
     * Creates a new donation
     *
     * @param {string} nickname
     * @param {string} job
     * @param {string} Bio
     * @param {string} academicAertificate
     * @param {string} address
     * @param {string} location
     * @param {string} hobbys
     * @param {string} dateOfBirth
     * @param {string} memoryId
     * @param {string} achievementId
     * @param {string} authorId
     */
    createProfile: async (
        root,
        { input: { nickname, job, Bio, academicAertificate, address, location, 
            hobbys, dateOfBirth, authorId} },
        { Profile, User}
    ) => {
        const newProfile = await new Profile({
            nickname,
            job,
            Bio,
            academicAertificate,
            address,
            location,
            hobbys,
            dateOfBirth,
            author: authorId,
        }).save();

        await User.findOneAndUpdate(
            { _id: authorId },
            { $push: { profile: newProfile.id } }
        );

        return newProfile;
    },
    /**
     * Deletes a user profile
     *
     * @param {string} id
     */
    deleteProfile: async (
        root,
        { input: { id} },
        { Profile,  User }
    ) => {

        // Find profile and remove it
        const profile = await Profile.findByIdAndRemove(id);

        // Delete Profile from authors (users) Profiles collection
        await User.findOneAndUpdate(
            { _id: profile.author },
            { $pull: { profiles: profile.id } }
        );

        return profile;
    },
};

export default { Query, Mutation };