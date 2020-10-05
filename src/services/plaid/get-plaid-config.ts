import plaid, { ClientConfigs } from 'plaid';

const { PLAID_CLIENT_ID: clientID, PLAID_SECRET: secret } = process.env;

export default function getPlaidConfig(): ClientConfigs {
	if (typeof clientID !== 'string') {
		throw new Error('Plaid client ID does not exist.');
	}
	if (typeof secret !== 'string') {
		throw new Error('Plaid secret does not exist.');
	}
	return {
		clientID,
		secret,
		options: {},
		env: plaid.environments.development,
	};
}
