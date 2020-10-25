import * as plaid from 'plaid';

const {
	PLAID_CLIENT_ID: clientID,
	PLAID_SECRET: secret,
	PLAID_ENV: env,
} = process.env;

export default function getPlaidConfig(): plaid.ClientConfigs {
	if (typeof clientID !== 'string') {
		throw new Error('Plaid client ID does not exist.');
	}
	if (typeof secret !== 'string') {
		throw new Error('Plaid secret does not exist.');
	}
	if (typeof env !== 'string') {
		throw new Error('Plaid environment does not exist.');
	}
	return {
		clientID,
		secret,
		options: {},
		env: plaid.environments[env],
	};
}
