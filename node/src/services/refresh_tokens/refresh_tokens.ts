const { refresh_tokens } = require('../../db/mongo.ts');

interface RefreshTokensDeleteOne {
	userId?: string;
	openId?: string;
	refreshToken?: string;
}
const refresh_tokens_deleteOne = async (data: RefreshTokensDeleteOne): Promise<void> => {
	await refresh_tokens.deleteOne(data);
};

module.exports = {
	refresh_tokens_deleteOne,
};
